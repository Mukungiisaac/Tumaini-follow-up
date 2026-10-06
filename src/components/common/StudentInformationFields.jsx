import React from 'react';
import { EMPTY_STUDENT_INFORMATION } from '../../data/studentInformation';

const PARENT_FIELDS = [
  ['firstName', 'First Name'],
  ['middleName', 'Middle Name'],
  ['lastName', 'Last Name'],
  ['relationship', 'Relationship'],
  ['idType', 'Type of ID'],
  ['nationalId', 'National ID Number'],
  ['mobile', 'Mobile Number'],
  ['email', 'Email Address'],
  ['countryOfResidence', 'Country of Residence']
];

function TextField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
      />
    </label>
  );
}

function ParentFields({ title, name, details, onChange }) {
  return (
    <details className="rounded-lg border border-slate-200 bg-white">
      <summary className="px-4 py-3 text-sm font-semibold text-slate-800 cursor-pointer">{title}</summary>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-0">
        {PARENT_FIELDS.map(([field, label]) => (
          <TextField
            key={field}
            label={label}
            value={details[field]}
            onChange={(value) => onChange(name, field, value)}
          />
        ))}
      </div>
    </details>
  );
}

export default function StudentInformationFields({ value = {}, onChange, sponsorTitle = "Child's Sponsor" }) {
  const details = {
    ...EMPTY_STUDENT_INFORMATION,
    ...value,
    birthCertificateName: { ...EMPTY_STUDENT_INFORMATION.birthCertificateName, ...value.birthCertificateName },
    mother: { ...EMPTY_STUDENT_INFORMATION.mother, ...value.mother },
    father: { ...EMPTY_STUDENT_INFORMATION.father, ...value.father },
    guardian: { ...EMPTY_STUDENT_INFORMATION.guardian, ...value.guardian }
  };

  const updateField = (field, nextValue) => onChange({ ...details, [field]: nextValue });
  const updateParent = (parent, field, nextValue) => onChange({
    ...details,
    [parent]: { ...details[parent], [field]: nextValue }
  });

  return (
    <section className="space-y-3" aria-label="Student registration information">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Student information</h3>
        <p className="mt-1 text-xs text-slate-500">Registration, identity, birth, health, and family contact details.</p>
      </div>

      <div className="rounded-lg border border-slate-200 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">Admission and school</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Admission Number" value={details.admissionNumber} onChange={(next) => updateField('admissionNumber', next)} />
          <TextField label="Class Stream" value={details.stream} onChange={(next) => updateField('stream', next)} />
          <TextField label="School" value={details.schoolName} onChange={(next) => updateField('schoolName', next)} />
          <TextField label="KCPE / KCSE Index Number" value={details.examIndexNumber} onChange={(next) => updateField('examIndexNumber', next)} />
          <TextField label="KCPE / KCSE Year" value={details.examYear} onChange={(next) => updateField('examYear', next)} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">{sponsorTitle}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Sponsor Name" value={details.sponsorName} onChange={(next) => updateField('sponsorName', next)} />
          <TextField label="Sponsor Email" type="email" value={details.sponsorEmail} onChange={(next) => updateField('sponsorEmail', next)} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">Learner details as recorded</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Birth Certificate First Name" value={details.birthCertificateName.firstName} onChange={(next) => updateField('birthCertificateName', { ...details.birthCertificateName, firstName: next })} />
          <TextField label="Birth Certificate Middle Name" value={details.birthCertificateName.middleName} onChange={(next) => updateField('birthCertificateName', { ...details.birthCertificateName, middleName: next })} />
          <TextField label="Birth Certificate Last Name" value={details.birthCertificateName.lastName} onChange={(next) => updateField('birthCertificateName', { ...details.birthCertificateName, lastName: next })} />
          <TextField label="Birth Certificate Entry Number" value={details.birthCertificateEntryNumber} onChange={(next) => updateField('birthCertificateEntryNumber', next)} />
          <TextField label="Date of Birth" type="date" value={details.dateOfBirth} onChange={(next) => updateField('dateOfBirth', next)} />
          <TextField label="Nationality" value={details.nationality} onChange={(next) => updateField('nationality', next)} />
          <TextField label="Country of Birth" value={details.countryOfBirth} onChange={(next) => updateField('countryOfBirth', next)} />
          <TextField label="County of Birth" value={details.countyOfBirth} onChange={(next) => updateField('countyOfBirth', next)} />
          <TextField label="Sub-County of Birth" value={details.subCountyOfBirth} onChange={(next) => updateField('subCountyOfBirth', next)} />
          <TextField label="Location of Birth" value={details.locationOfBirth} onChange={(next) => updateField('locationOfBirth', next)} />
          <TextField label="Religion" value={details.religion} onChange={(next) => updateField('religion', next)} />
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-[11px] font-medium text-slate-600">Medical Condition</span>
            <textarea rows="2" value={details.medicalCondition} onChange={(event) => updateField('medicalCondition', event.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]" />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-[11px] font-medium text-slate-600">Educational Support Needs</span>
            <textarea rows="2" value={details.educationalNeeds} onChange={(event) => updateField('educationalNeeds', event.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]" />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <ParentFields title="Mother's Details" name="mother" details={details.mother} onChange={updateParent} />
        <ParentFields title="Father's Details" name="father" details={details.father} onChange={updateParent} />
        <ParentFields title="Guardian's Details (if no parent details are available)" name="guardian" details={details.guardian} onChange={updateParent} />
      </div>
    </section>
  );
}