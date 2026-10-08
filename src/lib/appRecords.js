import { supabase } from './supabase';

export async function listAppRecords() {
  const { data, error } = await supabase
    .from('app_records')
    .select('record_type, id, payload')
    .order('record_type')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return (data || []).reduce((records, row) => {
    records[row.record_type].push(row.payload);
    return records;
  }, { children: [], houses: [], sessions: [], activities: [], mentors: [] });
}

export async function saveAppRecord(recordType, record, userId) {
  const { error } = await supabase
    .from('app_records')
    .upsert({
      record_type: recordType,
      id: String(record.id),
      payload: record,
      updated_at: new Date().toISOString(),
      updated_by: userId
    }, { onConflict: 'record_type,id' });

  if (error) throw error;
}

export async function insertAppRecords(records, userId) {
  const rows = Object.entries(records).flatMap(([recordType, items]) => items.map((record) => ({
    record_type: recordType,
    id: String(record.id),
    payload: record,
    updated_at: new Date().toISOString(),
    updated_by: userId
  })));

  if (rows.length === 0) return;

  const { error } = await supabase.from('app_records').insert(rows);
  if (error) throw error;
}

export async function removeAppRecord(recordType, recordId) {
  const { error } = await supabase
    .from('app_records')
    .delete()
    .eq('record_type', recordType)
    .eq('id', String(recordId));

  if (error) throw error;
}