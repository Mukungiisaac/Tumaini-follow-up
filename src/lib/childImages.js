import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export const CHILD_IMAGE_BUCKET = 'child-images';
export const MAX_CHILD_IMAGE_SIZE = 5 * 1024 * 1024;
const childImageExtensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};
const signedUrlCache = new Map();

export function isChildImageStoragePath(image) {
  return typeof image === 'string' && image.startsWith('children/');
}

export async function uploadChildImage(file, childId) {
  const isBlob = typeof Blob !== 'undefined' && file instanceof Blob;
  const isFile = typeof File !== 'undefined' && file instanceof File;
  console.info('[ChildImages] Upload input:', {
    fileType: typeof file === 'string' && file.startsWith('data:') ? 'data URL' : file?.type || '',
    fileSize: file?.size ?? null,
    isFile,
    isBlob,
    isDataUrl: typeof file === 'string' && file.startsWith('data:')
  });

  if (!isBlob) throw new TypeError('Child photo upload requires a File or Blob.');
  if (file.size <= 0) throw new Error('Child photo upload requires a non-empty file.');
  if (file.size > MAX_CHILD_IMAGE_SIZE) {
    throw new Error('Child photo must be 5 MB or smaller.');
  }

  const contentType = file.type;
  const extension = childImageExtensions[contentType.toLowerCase()];
  if (!extension) {
    throw new Error('Child photo must be a JPEG, PNG, or WebP image.');
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('[ChildImages] Failed to verify the authenticated session:', sessionError);
    throw sessionError;
  }
  if (!session) {
    throw new Error('You must be signed in to upload photos. Please sign in again.');
  }

  const safeChildId = String(childId ?? '').replace(/[^a-zA-Z0-9_-]/g, '_');
  if (!safeChildId) throw new Error('Child photo upload requires a valid child ID.');
  const path = `children/${safeChildId}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const options = {
    cacheControl: '3600',
    contentType,
    upsert: false
  };
  const { data, error } = await supabase.storage
    .from(CHILD_IMAGE_BUCKET)
    .upload(path, file, options);

  if (error) {
    console.error('[ChildImages] Storage upload failed:', {
      bucket: CHILD_IMAGE_BUCKET,
      path,
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
      details: error.details,
      cause: error.cause,
      storageError: error
    });
    throw error;
  }

  const storedPath = data.path;
  signedUrlCache.delete(storedPath);
  return storedPath;
}

export async function deleteChildImage(path) {
  if (!isChildImageStoragePath(path)) return;

  const { error } = await supabase.storage.from(CHILD_IMAGE_BUCKET).remove([path]);
  if (error) throw error;
  signedUrlCache.delete(path);
}

function getSignedUrl(path) {
  const cached = signedUrlCache.get(path);
  if (cached) return cached;

  const request = supabase.storage.from(CHILD_IMAGE_BUCKET)
    .createSignedUrl(path, 3600)
    .then((result) => {
      const { data, error } = result;
      const logDetails = { bucket: CHILD_IMAGE_BUCKET, path, data, error };
      if (error) {
        console.error('[ChildImages] Signed URL request failed:', logDetails);
        throw error;
      }
      console.info('[ChildImages] Signed URL response:', logDetails);
      if (!data?.signedUrl) {
        throw new Error(`Supabase returned no signed URL for ${CHILD_IMAGE_BUCKET}/${path}.`);
      }
      return data.signedUrl;
    })
    .catch((error) => {
      console.error('[ChildImages] Signed URL request threw:', {
        bucket: CHILD_IMAGE_BUCKET,
        path,
        error
      });
      throw error;
    });

  signedUrlCache.set(path, request);
  return request;
}

export function useChildImageUrl(image) {
  const [resolvedImage, setResolvedImage] = useState({ path: '', url: '' });

  useEffect(() => {
    if (!isChildImageStoragePath(image)) return undefined;

    let isActive = true;
    getSignedUrl(image)
      .then((url) => {
        if (isActive) setResolvedImage({ path: image, url });
      })
      .catch(() => {
        if (isActive) setResolvedImage({ path: image, url: '' });
      });

    return () => {
      isActive = false;
    };
  }, [image]);

  if (!image) return '';
  if (!isChildImageStoragePath(image)) return image;
  return resolvedImage.path === image ? resolvedImage.url : '';
}
