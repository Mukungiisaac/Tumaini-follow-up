import { supabase, supabaseAnonKey, supabaseUrl } from './supabase';
import { CHILD_IMAGE_BUCKET } from './childImages';

export const SIGNING_DIAGNOSTIC_PATH =
  'children/c_1790860087240/a2e77aa3-cf5c-4207-b90b-825f2f41c585';
const signedUrlLifetimeSeconds = 3600;

const diagnosticPng = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/XioAAAAASUVORK5CYII='),
  (character) => character.charCodeAt(0)
);

function createStep() {
  return { passed: false, error: '' };
}

function recordStepError(results, stepName, error) {
  console.error(`[Storage Diagnostic] ${stepName} failed:`, error);
  const statusCode = error?.statusCode || error?.status;
  const details = error?.error;
  const message = error?.message || String(error);
  const suffix = [
    statusCode ? `status ${statusCode}` : '',
    details ? `detail: ${typeof details === 'string' ? details : JSON.stringify(details)}` : ''
  ].filter(Boolean).join(', ');
  const description = `${stepName}: ${message}${suffix ? ` (${suffix})` : ''}`;
  results.steps[stepName].error = description;
  results.errors.push(description);
}

async function serializeDiagnosticValue(value, seen = new WeakSet(), depth = 0) {
  if (value === null || value === undefined || typeof value !== 'object') return value;
  if (depth > 8) return '[Maximum diagnostic detail depth reached]';
  if (seen.has(value)) return '[Circular reference]';
  seen.add(value);

  if (typeof Response !== 'undefined' && value instanceof Response) {
    return {
      type: 'Response',
      status: value.status,
      statusText: value.statusText,
      headers: Object.fromEntries(value.headers.entries()),
      body: await value.clone().text()
    };
  }

  if (typeof Headers !== 'undefined' && value instanceof Headers) {
    return Object.fromEntries(value.entries());
  }

  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return { type: 'Blob', size: value.size, mimeType: value.type };
  }

  if (value instanceof Error) {
    const serializedError = {};
    for (const key of Object.getOwnPropertyNames(value)) {
      serializedError[key] = await serializeDiagnosticValue(value[key], seen, depth + 1);
    }
    return serializedError;
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => serializeDiagnosticValue(item, seen, depth + 1)));
  }

  const serializedObject = {};
  for (const [key, item] of Object.entries(value)) {
    serializedObject[key] = await serializeDiagnosticValue(item, seen, depth + 1);
  }
  return serializedObject;
}

async function runClientSigningTest() {
  try {
    const result = await supabase.storage
      .from(CHILD_IMAGE_BUCKET)
      .createSignedUrl(SIGNING_DIAGNOSTIC_PATH, signedUrlLifetimeSeconds);
    return {
      passed: !result.error && Boolean(result.data?.signedUrl),
      data: await serializeDiagnosticValue(result.data),
      error: await serializeDiagnosticValue(result.error)
    };
  } catch (error) {
    return {
      passed: false,
      data: null,
      error: await serializeDiagnosticValue(error)
    };
  }
}

async function runClientDownloadTest() {
  try {
    const result = await supabase.storage
      .from(CHILD_IMAGE_BUCKET)
      .download(SIGNING_DIAGNOSTIC_PATH);
    return {
      passed: !result.error && Boolean(result.data),
      data: await serializeDiagnosticValue(result.data),
      error: await serializeDiagnosticValue(result.error)
    };
  } catch (error) {
    return {
      passed: false,
      data: null,
      error: await serializeDiagnosticValue(error)
    };
  }
}

async function runBareFetchSigningTest() {
  let session;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return {
        passed: false,
        data: null,
        error: await serializeDiagnosticValue(error)
      };
    }
    session = data.session;
  } catch (error) {
    return {
      passed: false,
      data: null,
      error: await serializeDiagnosticValue(error)
    };
  }

  if (!session?.access_token) {
    return {
      passed: false,
      data: null,
      error: {
        name: 'MissingSessionError',
        message: 'No current Supabase Auth session access token is available.'
      }
    };
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      passed: false,
      data: null,
      error: {
        name: 'SupabaseConfigurationError',
        message: 'Supabase URL or anon key is not configured.'
      }
    };
  }

  const url = `${supabaseUrl}/storage/v1/object/sign/${CHILD_IMAGE_BUCKET}/${SIGNING_DIAGNOSTIC_PATH}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: '{"expiresIn":3600}'
    });
    const body = await response.text();
    let parsedBody = body;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      // Keep non-JSON response bodies, such as an HTML proxy error, intact.
    }

    return {
      passed: response.ok,
      data: response.ok
        ? { status: response.status, statusText: response.statusText, body: parsedBody }
        : null,
      error: response.ok
        ? null
        : {
            name: 'HttpError',
            message: `Bare signing request returned HTTP ${response.status} ${response.statusText}`.trim(),
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: parsedBody
          }
    };
  } catch (error) {
    return {
      passed: false,
      data: null,
      error: await serializeDiagnosticValue(error)
    };
  }
}

export async function runSigningRequestComparison() {
  const results = {
    bucket: CHILD_IMAGE_BUCKET,
    path: SIGNING_DIAGNOSTIC_PATH,
    clientCreateSignedUrl: await runClientSigningTest(),
    clientDownload: await runClientDownloadTest(),
    bareFetchCreateSignedUrl: await runBareFetchSigningTest()
  };
  console.info('[Storage Diagnostic] Signing request comparison:', results);
  return results;
}

export async function checkStorageHealth(existingPath = '') {
  const results = {
    authenticated: false,
    userId: null,
    adminRecord: null,
    bucketExists: false,
    bucketConfiguration: null,
    canUpload: false,
    canRead: false,
    canDelete: false,
    existingPathDownload: null,
    steps: {
      authentication: createStep(),
      admin: createStep(),
      bucket: createStep(),
      existingDownload: createStep(),
      upload: createStep(),
      read: createStep(),
      delete: createStep()
    },
    errors: []
  };

  let session = null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      recordStepError(results, 'authentication', error);
    } else {
      session = data.session;
      results.authenticated = Boolean(session);
      results.userId = session?.user?.id || null;
      results.steps.authentication.passed = Boolean(session);
      if (!session) {
        results.steps.authentication.error = 'No signed-in Supabase Auth session.';
        results.errors.push('Authentication: no signed-in Supabase Auth session.');
      }
    }
  } catch (error) {
    recordStepError(results, 'authentication', error);
  }

  if (session) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id, email, active')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        recordStepError(results, 'admin lookup', error);
      } else {
        results.adminRecord = data;
        if (!data) {
          results.steps.admin.error = 'No admin_users record exists for this account.';
          results.errors.push(`Admin lookup: ${results.steps.admin.error}`);
        } else if (!data.active) {
          results.steps.admin.error = 'This admin account is inactive.';
          results.errors.push(`Admin lookup: ${results.steps.admin.error}`);
        } else {
          results.steps.admin.passed = true;
        }
      }
    } catch (error) {
      recordStepError(results, 'admin lookup', error);
    }
  }

  try {
    const { data: bucket, error } = await supabase.storage.getBucket(CHILD_IMAGE_BUCKET);
    if (error) {
      recordStepError(results, 'bucket', error);
    } else {
      results.bucketExists = bucket?.id === CHILD_IMAGE_BUCKET;
      results.steps.bucket.passed = results.bucketExists;
      if (results.bucketExists) {
        results.bucketConfiguration = {
          public: bucket.public,
          fileSizeLimit: bucket.file_size_limit,
          allowedMimeTypes: bucket.allowed_mime_types
        };
      }
      if (!results.bucketExists) {
        recordStepError(results, 'bucket', new Error(`Bucket "${CHILD_IMAGE_BUCKET}" was not returned by Supabase.`));
      }
    }
  } catch (error) {
    recordStepError(results, 'bucket', error);
  }

  if (existingPath) {
    results.existingPathDownload = { path: existingPath, passed: false, error: '' };
    if (!existingPath.startsWith('children/') || existingPath.startsWith('/')) {
      const error = new Error('Enter the exact object path beginning with "children/" and without a leading slash.');
      recordStepError(results, 'existingDownload', error);
      results.existingPathDownload.error = error.message;
    } else if (!results.bucketExists || !session) {
      const reason = !results.bucketExists
        ? 'Skipped: bucket is unavailable.'
        : 'Skipped: sign in to test Storage access.';
      results.steps.existingDownload.error = reason;
      results.existingPathDownload.error = reason;
    } else {
      try {
        const { data, error } = await supabase.storage
          .from(CHILD_IMAGE_BUCKET)
          .download(existingPath);
        console.info('[Storage Diagnostic] Existing object download response:', {
          bucket: CHILD_IMAGE_BUCKET,
          path: existingPath,
          data,
          error
        });
        if (error) {
          recordStepError(results, 'existingDownload', error);
          results.existingPathDownload.error = error.message || String(error);
        } else {
          results.steps.existingDownload.passed = true;
          results.existingPathDownload.passed = true;
        }
      } catch (error) {
        recordStepError(results, 'existingDownload', error);
        results.existingPathDownload.error = error?.message || String(error);
      }
    }
  }

  if (!results.bucketExists || !session || !results.adminRecord?.active) {
    const reason = !results.bucketExists
      ? 'Skipped: bucket is unavailable.'
      : !session
        ? 'Skipped: sign in to test Storage access.'
        : 'Skipped: an active admin account is required by the Storage policies.';
    for (const stepName of ['upload', 'read', 'delete']) {
      results.steps[stepName].error = reason;
    }
    return results;
  }

  const testPath = `diagnostics/${crypto.randomUUID()}.png`;
  const testFile = new Blob([diagnosticPng], { type: 'image/png' });
  let uploaded = false;

  try {
    const { error } = await supabase.storage
      .from(CHILD_IMAGE_BUCKET)
      .upload(testPath, testFile, {
        contentType: 'image/png',
        upsert: false
      });
    if (error) {
      recordStepError(results, 'upload', error);
    } else {
      uploaded = true;
      results.canUpload = true;
      results.steps.upload.passed = true;
    }
  } catch (error) {
    recordStepError(results, 'upload', error);
  }

  if (uploaded) {
    try {
      const { data, error } = await supabase.storage
        .from(CHILD_IMAGE_BUCKET)
        .download(testPath);
      if (error) {
        recordStepError(results, 'read', error);
      } else {
        const downloadedBytes = new Uint8Array(await data.arrayBuffer());
        const matchesUploadedFile = downloadedBytes.length === diagnosticPng.length
          && downloadedBytes.every((byte, index) => byte === diagnosticPng[index]);
        if (!matchesUploadedFile) {
          recordStepError(results, 'read', new Error('Downloaded test file did not match the uploaded test image.'));
        } else {
          results.canRead = true;
          results.steps.read.passed = true;
        }
      }
    } catch (error) {
      recordStepError(results, 'read', error);
    } finally {
      try {
        const { error } = await supabase.storage.from(CHILD_IMAGE_BUCKET).remove([testPath]);
        if (error) {
          recordStepError(results, 'delete', error);
        } else {
          results.canDelete = true;
          results.steps.delete.passed = true;
        }
      } catch (error) {
        recordStepError(results, 'delete', error);
      }
    }
  } else {
    results.steps.read.error = 'Skipped: the test upload did not succeed.';
    results.steps.delete.error = 'Skipped: no test file was uploaded.';
  }

  return results;
}

export async function logStorageHealth() {
  console.group('Storage Health Check');
  const health = await checkStorageHealth();
  console.log('Authentication:', health.steps.authentication);
  if (health.userId) console.log('User ID:', health.userId);
  console.log('Admin record:', health.adminRecord);
  console.log('Bucket exists:', health.steps.bucket);
  console.log('Bucket configuration:', health.bucketConfiguration);
  console.log('Upload:', health.steps.upload);
  console.log('Read back:', health.steps.read);
  console.log('Delete:', health.steps.delete);
  console.groupEnd();
  return health;
}

if (import.meta.env.DEV) {
  window.checkStorageHealth = checkStorageHealth;
  window.logStorageHealth = logStorageHealth;
}
