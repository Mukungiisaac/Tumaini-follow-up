import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Settings, Save, Camera, CheckCircle2, Building, AlertCircle, Loader2 } from 'lucide-react';
import LinkedAdminsPanel from '../components/auth/LinkedAdminsPanel';
import { checkStorageHealth, runSigningRequestComparison, SIGNING_DIAGNOSTIC_PATH } from '../lib/storageHealthCheck';

export default function SettingsView() {
  const { currentUser, handleUpdateUser, houses = [], handleUpdateHouse } = useOutletContext();
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const avatarInputRef = useRef(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [existingObjectPath, setExistingObjectPath] = useState('');
  const [isComparisonRunning, setIsComparisonRunning] = useState(false);
  const [signingComparisonResult, setSigningComparisonResult] = useState(null);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Sarah Johnson',
    role: currentUser?.role || 'Head Mentor',
    email: currentUser?.email || 'sarah.j@tumaini.org',
    phone: currentUser?.phone || '+254 712 345 678',
    department: currentUser?.department || 'Holistic Child Mentorship',
    avatar: currentUser?.avatar || '/assets/mentors/sarah_j.jpg'
  });

  const presetAvatars = [
    { label: 'Sarah J.', url: '/assets/mentors/sarah_j.jpg' },
    { label: 'David K.', url: '/assets/children/david_k.jpg' },
    { label: 'John D.', url: '/assets/children/samuel_o.jpg' },
    { label: 'Esther M.', url: '/assets/children/esther_l.jpg' },
    { label: 'Default Mentor', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' }
  ];

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const image = await createImageBitmap(file);
      const scale = Math.min(1, 512 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();

      const compressedImage = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Image compression failed')), 'image/jpeg', 0.82);
      });
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData((previous) => ({ ...previous, avatar: reader.result }));
        setAvatarError('');
      };
      reader.onerror = () => setAvatarError('Could not read this image. Please try another file.');
      reader.readAsDataURL(compressedImage);
    } catch {
      setAvatarError('Could not process this image. Please try another file.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (handleUpdateUser) {
      handleUpdateUser(profileData);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const diagnosticPassed = Boolean(
    diagnosticResult?.authenticated
    && diagnosticResult?.adminRecord?.active
    && diagnosticResult?.bucketExists
    && diagnosticResult?.canUpload
    && diagnosticResult?.canRead
    && diagnosticResult?.canDelete
    && (!diagnosticResult?.existingPathDownload || diagnosticResult.existingPathDownload.passed)
  );

  const runDiagnostic = async () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult(null);
    try {
      const result = await checkStorageHealth(existingObjectPath);
      setDiagnosticResult(result);
    } catch (err) {
      const statusCode = err?.statusCode || err?.status;
      const errorDetail = err?.error ? ` (${err.error})` : '';
      setDiagnosticResult({
        authenticated: false,
        bucketExists: false,
        canUpload: false,
        canRead: false,
        canDelete: false,
        bucketConfiguration: null,
        adminRecord: null,
        errors: [`Diagnostic failed: ${err?.message || String(err)}${statusCode ? ` (status ${statusCode})` : ''}${errorDetail}`]
      });
    } finally {
      setIsDiagnosticRunning(false);
    }
  };

  const runSigningComparison = async () => {
    setIsComparisonRunning(true);
    setSigningComparisonResult(null);
    try {
      setSigningComparisonResult(await runSigningRequestComparison());
    } catch (error) {
      setSigningComparisonResult({
        bucket: 'child-images',
        path: SIGNING_DIAGNOSTIC_PATH,
        comparisonError: {
          name: error?.name || 'Error',
          message: error?.message || String(error),
          ...error
        }
      });
    } finally {
      setIsComparisonRunning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0C3440] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-[#0C3440]/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#D99B3C] text-xs font-mono uppercase font-bold tracking-widest">
            <Settings className="w-4 h-4" /> USER PROFILE & SYSTEM SETTINGS
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Account Preferences
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Update your profile name, role title, email, avatar image, and village system configuration.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and system settings updated successfully! Header user profile pill has been refreshed.</span>
          </div>
        )}

        {/* Card 1: User Profile Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <User className="w-5 h-5 text-[#0C3440]" />
            <h3 className="text-base font-bold text-slate-900">User Profile Information</h3>
          </div>

          {/* Avatar Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
                }}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#D99B3C]/60 shadow-md"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                title="Choose profile photo"
                aria-label="Choose profile photo"
                className="absolute bottom-0 right-0 p-1.5 bg-[#0C3440] text-white rounded-full shadow-xs hover:bg-[#164957] focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 flex-1 w-full">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono">
                Profile Avatar Image
              </label>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#E8F0F0] text-[#0C3440] rounded-lg text-xs font-semibold hover:bg-[#D4E4E4] transition-colors"
              >
                <Camera className="w-4 h-4" /> Choose photo
              </button>
              <input
                type="text"
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                placeholder="Enter image URL or select preset below..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
              {avatarError && <p role="alert" className="text-xs text-rose-700">{avatarError}</p>}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 font-mono">PRESETS:</span>
                {presetAvatars.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setProfileData({ ...profileData, avatar: p.url })}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      profileData.avatar === p.url
                        ? 'bg-[#0C3440] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name & Role Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>
          </div>

          {/* Email & Phone Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Village Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-5 h-5 text-[#0C3440]" />
            <h3 className="text-base font-bold text-slate-900">Village Configuration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Organization Name</label>
              <input
                type="text"
                defaultValue="Tumaini Children's Village"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Active Academic Term</label>
              <input
                type="text"
                defaultValue="School Term 3, 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-5 h-5 text-[#0C3440]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">House Parents</h3>
              <p className="text-xs text-slate-500">Set the parent couple responsible for each house.</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {houses.map((house) => (
              <div key={house.id} className="grid grid-cols-1 sm:grid-cols-[100px_1fr_1fr] gap-3 py-3 items-center">
                <h4 className="text-sm font-bold text-slate-800">House {house.id}</h4>
                <input
                  type="text"
                  aria-label={`House ${house.id} first parent`}
                  placeholder="Parent / guardian 1"
                  value={house.parentOne}
                  onChange={(e) => handleUpdateHouse({ ...house, parentOne: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
                />
                <input
                  type="text"
                  aria-label={`House ${house.id} second parent`}
                  placeholder="Parent / guardian 2"
                  value={house.parentTwo}
                  onChange={(e) => handleUpdateHouse({ ...house, parentTwo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-[#0C3440] hover:bg-[#164957] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#0C3440]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile & Settings
          </button>
        </div>
      </form>

      {/* Storage Diagnostic Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <AlertCircle className="w-5 h-5 text-[#0C3440]" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Storage Diagnostic</h3>
            <p className="text-xs text-slate-500">Check if photo uploads are working correctly</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            If you're experiencing issues uploading child photos (HTTP 400 errors), run this diagnostic to identify the problem.
            Optionally enter an existing child image path to test downloading that exact object.
          </p>

          <label className="block space-y-1 text-xs">
            <span className="font-semibold text-slate-700">Existing object path (optional)</span>
            <input
              type="text"
              value={existingObjectPath}
              onChange={(event) => setExistingObjectPath(event.target.value)}
              placeholder="children/<child-id>/<file-name>"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
            />
          </label>

          <button
            type="button"
            onClick={runDiagnostic}
            disabled={isDiagnosticRunning}
            className="px-4 py-2 bg-[#E8F0F0] text-[#0C3440] rounded-lg text-xs font-semibold hover:bg-[#D4E4E4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDiagnosticRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running Diagnostic...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Run Storage Health Check
              </>
            )}
          </button>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Temporary signing request comparison</h4>
              <p className="mt-1 text-[11px] text-slate-600 break-all">
                Tests the existing private object: {SIGNING_DIAGNOSTIC_PATH}
              </p>
            </div>
            <button
              type="button"
              onClick={runSigningComparison}
              disabled={isComparisonRunning}
              className="px-4 py-2 bg-[#0C3440] text-white rounded-lg text-xs font-semibold hover:bg-[#164957] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isComparisonRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running three tests...
                </>
              ) : (
                'Run signing comparison'
              )}
            </button>

            {signingComparisonResult && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold">Bucket:</span> {signingComparisonResult.bucket}
                  <br />
                  <span className="font-semibold">Path:</span>{' '}
                  <span className="break-all">{signingComparisonResult.path}</span>
                </div>
                {[
                  ['Client createSignedUrl', signingComparisonResult.clientCreateSignedUrl],
                  ['Client download', signingComparisonResult.clientDownload],
                  ['Bare fetch createSignedUrl', signingComparisonResult.bareFetchCreateSignedUrl]
                ].map(([label, result]) => result && (
                  <section key={label} className="rounded-lg border border-slate-200 bg-white p-3 space-y-1">
                    <h5 className="font-bold">
                      {result.passed ? '✓' : '✗'} {label}
                    </h5>
                    {result.data !== undefined && (
                      <div>
                        <span className="font-semibold">Data:</span>
                        <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-50 p-2 text-[10px]">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Full error object:</span>
                      <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-50 p-2 text-[10px]">
                        {JSON.stringify(result.error, null, 2) ?? 'null'}
                      </pre>
                    </div>
                  </section>
                ))}
                {signingComparisonResult.comparisonError && (
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-rose-50 p-2 text-[10px]">
                    {JSON.stringify(signingComparisonResult.comparisonError, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {diagnosticResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              diagnosticPassed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="font-bold font-mono uppercase tracking-wide text-[10px]">
                {diagnosticPassed ? '✅ All Systems Operational' : '⚠️ Issues Detected'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={diagnosticResult.authenticated ? 'text-emerald-600' : 'text-rose-600'}>
                    {diagnosticResult.authenticated ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold">Authentication:</span>
                  <span>{diagnosticResult.authenticated ? 'Signed In' : 'Not Authenticated'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={diagnosticResult.adminRecord?.active ? 'text-emerald-600' : 'text-rose-600'}>
                    {diagnosticResult.adminRecord?.active ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold">Admin Record:</span>
                  <span>
                    {diagnosticResult.adminRecord
                      ? (diagnosticResult.adminRecord.active ? 'Active' : 'Inactive')
                      : 'Not Found'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={diagnosticResult.bucketExists ? 'text-emerald-600' : 'text-rose-600'}>
                    {diagnosticResult.bucketExists ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold">Storage Bucket:</span>
                  <span>{diagnosticResult.bucketExists ? 'Exists' : 'Not Found'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={diagnosticResult.canUpload ? 'text-emerald-600' : 'text-rose-600'}>
                    {diagnosticResult.canUpload ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold">Test Upload:</span>
                  <span>{diagnosticResult.canUpload ? 'Passed' : 'Failed or skipped'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={diagnosticResult.canRead ? 'text-emerald-600' : 'text-rose-600'}>
                    {diagnosticResult.canRead ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold">Read Back:</span>
                  <span>{diagnosticResult.canRead ? 'Passed' : 'Failed or skipped'}</span>
                </div>

                {diagnosticResult.existingPathDownload && (
                  <div className="flex items-center gap-2 break-all">
                    <span className={diagnosticResult.existingPathDownload.passed ? 'text-emerald-600' : 'text-rose-600'}>
                      {diagnosticResult.existingPathDownload.passed ? '✓' : '✗'}
                    </span>
                    <span className="font-semibold">Existing object download:</span>
                    <span>
                      {diagnosticResult.existingPathDownload.passed
                        ? 'Passed'
                        : diagnosticResult.existingPathDownload.error || 'Failed'}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className={diagnosticResult.canDelete ? 'text-emerald-600' : 'text-rose-600'}>
                    {diagnosticResult.canDelete ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold">Test File Cleanup:</span>
                  <span>{diagnosticResult.canDelete ? 'Passed' : 'Failed or skipped'}</span>
                </div>
              </div>

              {diagnosticResult.bucketConfiguration && (
                <div className="pt-2 text-[11px]">
                  Bucket configuration: {Math.round(diagnosticResult.bucketConfiguration.fileSizeLimit / (1024 * 1024))} MB maximum;{' '}
                  {diagnosticResult.bucketConfiguration.allowedMimeTypes?.join(', ') || 'no MIME restrictions reported'};{' '}
                  {diagnosticResult.bucketConfiguration.public ? 'public' : 'private'} read.
                </div>
              )}

              {diagnosticResult.errors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200 space-y-1">
                  <div className="font-bold">Diagnostic details:</div>
                  {diagnosticResult.errors.map((error, idx) => (
                    <div key={idx} role="alert" className="text-[11px] break-words">• {error}</div>
                  ))}
                  {!diagnosticResult.bucketExists && (
                    <div className="mt-2 p-2 bg-amber-100 rounded text-[11px]">
                      <strong>Fix:</strong> Run <code className="bg-white px-1 py-0.5 rounded">supabase db push</code> to create the storage bucket
                    </div>
                  )}
                  {diagnosticResult.adminRecord && !diagnosticResult.adminRecord.active && (
                    <div className="mt-2 p-2 bg-amber-100 rounded text-[11px]">
                      <strong>Fix:</strong> Contact system administrator to activate your account
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <LinkedAdminsPanel email={currentUser?.email} />
    </div>
  );
}
