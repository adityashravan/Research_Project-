'use client';

import Header from '@/components/Header';
import { SensorData, supabase } from '@/lib/supabase';
import { calculateHeartDiseaseRisk, formatDateTime, cn } from '@/lib/utils';
import { Activity, Clock, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function DoctorsDashboard() {
  const [records, setRecords] = useState<SensorData[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('sensor_data').select('*').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => setRecords((data ?? []) as SensorData[]));
    const channel = supabase.channel('doctors_patient_updates').on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sensor_data' },
      ({ new: value }) => setRecords((old) => [value as SensorData, ...old].slice(0, 200))
    ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const patients = useMemo(() => {
    const map = new Map<string, { id: string; name: string; records: SensorData[] }>();
    records.forEach((record) => {
      const id = record.patient_id || `DEMO-${String((record.id % 4) + 1).padStart(3, '0')}`;
      const name = record.patient_name || `Demo Patient ${id.slice(-3)}`;
      if (!map.has(id)) map.set(id, { id, name, records: [] });
      map.get(id)!.records.push(record);
    });
    return [...map.values()];
  }, [records]);
  const active = patients.find((p) => p.id === selected) ?? patients[0];
  const latest = active?.records[0];

  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"><Header /><main className="container mx-auto px-4 py-8">
    <div className="mb-6"><p className="text-sm font-semibold text-primary-600 uppercase">Clinical view</p><h2 className="text-3xl font-bold text-gray-800 dark:text-white">Doctors Dashboard</h2><p className="text-gray-600 dark:text-gray-400">Live patient queue and longitudinal vital history</p></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="card"><div className="card-header"><h3 className="text-xl font-bold dark:text-white">Patients</h3><span className="text-sm text-gray-500">{patients.length} active</span></div><div className="space-y-2">{patients.map((p) => <button key={p.id} onClick={() => setSelected(p.id)} className={cn('w-full text-left p-4 rounded-lg border transition-colors', active?.id === p.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700')}><div className="flex items-center gap-3"><UserRound className="text-primary-500" /><div><p className="font-semibold dark:text-white">{p.name}</p><p className="text-xs text-gray-500">{p.id} · {p.records.length} records</p></div></div></button>)}</div></section>
      <section className="card lg:col-span-2">{latest ? <><div className="card-header"><div><h3 className="text-2xl font-bold dark:text-white">{active.name}</h3><p className="text-sm text-gray-500">{active.id} · latest reading {formatDateTime(latest.created_at)}</p></div><span className="flex items-center gap-2 text-green-600 text-sm"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Live</span></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">{[['Heart rate', `${latest.heart_rate} bpm`], ['SpO₂', `${latest.spo2}%`], ['Temperature', `${latest.temperature}°C`], ['Blood pressure', `${latest.blood_pressure_systolic}/${latest.blood_pressure_diastolic}`]].map(([label, value]) => <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-4" key={label}><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-bold dark:text-white">{value}</p></div>)}</div><div className="flex items-center gap-2 mb-3"><Clock className="w-5 h-5 text-primary-500" /><h4 className="font-bold dark:text-white">Patient history</h4></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-gray-500 border-b"><th className="py-2">Time</th><th>Vitals</th><th>ECG</th><th>Risk</th></tr></thead><tbody>{active.records.map((r) => { const risk = calculateHeartDiseaseRisk(r); return <tr key={r.id} className="border-b dark:border-gray-700"><td className="py-3 whitespace-nowrap dark:text-gray-200">{formatDateTime(r.created_at)}</td><td className="dark:text-gray-200">{r.heart_rate} bpm · {r.spo2}% · {r.blood_pressure_systolic}/{r.blood_pressure_diastolic}</td><td className="dark:text-gray-200">{r.ecg_value} V</td><td><span className={cn('px-2 py-1 rounded-full text-xs font-semibold', risk.level === 'critical' || risk.level === 'high' ? 'bg-red-100 text-red-700' : risk.level === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')}>{risk.level}</span></td></tr>})}</tbody></table></div></> : <div className="py-16 text-center text-gray-500"><Activity className="mx-auto mb-3" />Waiting for patient readings…</div>}</section>
    </div>
  </main></div>;
}
