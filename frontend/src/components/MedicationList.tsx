import React from 'react';
import type { Medication } from '../types';

export default function MedicationList({ meds, onDelete }: { meds: Medication[]; onDelete: (id: string) => Promise<void> }) {
  if (meds.length === 0) return <div className="small">Aucun médicament.</div>;
  return (
    <div>
      {meds.map(m => (
        <div key={m.id} className="list-item">
          <div>
            <div style={{ fontWeight: 600 }}>{m.name} {m.dose && <span className="small"> - {m.dose}</span>}</div>
            <div className="times" style={{ marginTop: 6 }}>
              {m.times.map((t, i) => <span key={i} className="time-pill">{t}</span>)}
            </div>
          </div>
          <div>
            <button className="btn" onClick={() => onDelete(m.id)}>Suppr</button>
          </div>
        </div>
      ))}
    </div>
  );
}
