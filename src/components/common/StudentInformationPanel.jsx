import React from 'react';

function DetailGrid({ title, fields }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <h3 className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-700">{title}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 p-5">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-1 text-sm text-slate-800 break-words">{value || 'Not recorded'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FamilySection({ title, details, includeRelationship = false }) {
  const fields = [
    ...(includeRelationship ? [['Relationship', details.relationship]] : []),
    ['First Name', details.firstName],
    ['Middle Name', details.middleName],
    ['Last Name', details.lastName],
    ['Type of ID', details.idType],
    ['National ID Number', details.nationalId],
    ['Mobile Number', details.mobile],
    ['Email Address', details.email],
    ['Country of Residence', details.countryOfResidence]
  ];

  return <DetailGrid title={title} fields={fields} />;
}

export default function StudentInformationPanel({ child }) {
  const information = child.studentInformation || {};
  const birthName = information.birthCertificateName || {};

  return (
    <div className="space-y-4">
      <DetailGrid
        title="Admission and School"
        fields={[
          ['Admission Number', information.admissionNumber],
          ['Date Joined', child.joinedDate],
          ['Class / Grade', child.grade],
          ['Stream', information.stream],
          ['School', information.schoolName],
          ['House', child.houseId ? `House ${child.houseId}` : 'Unassigned'],
          ['Age', child.age ? `${child.age} years` : ''],
          ['Date of Birth', information.dateOfBirth],
          ['KCPE / KCSE Index Number', information.examIndexNumber],
          ['KCPE / KCSE Year', information.examYear]
        ]}
      />
      <DetailGrid
        title="Learner and Birth Certificate Details"
        fields={[
          ['First Name', birthName.firstName],
          ['Middle Name', birthName.middleName],
          ['Last Name', birthName.lastName],
          ['Birth Certificate Entry Number', information.birthCertificateEntryNumber],
          ['Nationality', information.nationality],
          ['Country of Birth', information.countryOfBirth],
          ['County of Birth', information.countyOfBirth],
          ['Sub-County of Birth', information.subCountyOfBirth],
          ['Location of Birth', information.locationOfBirth],
          ['Religion', information.religion],
          ['Health Status', child.healthStatus],
          ['Medical Condition', information.medicalCondition],
          ['Health Notes', child.healthNotes],
          ['Educational Support Needs', information.educationalNeeds]
        ]}
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <FamilySection title="Mother's Details" details={information.mother || {}} />
        <FamilySection title="Father's Details" details={information.father || {}} />
        <FamilySection title="Guardian's Details" details={information.guardian || {}} includeRelationship />
      </div>
    </div>
  );
}