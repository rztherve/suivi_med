import React, { useState } from 'react';

export default function MedicationForm({ onSubmit }: { onSubmit: (payload: { name: string; dose?: string; times: string[] }) => Promise<void> }) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateTime(index: number, value: string) {
    const copy = [...times];
    copy[index] = value;
    setTimes(copy);
  }
  function addTime() { setTimes([...times, '08:00']); }
  function removeTime(i: number) { setTimes(times.filter((_, idx) => idx !== i)); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError('Nom requis'); return; }
    if (times.length === 0) { setError('Au moins un horaire requis'); return; }
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), dose: dose.trim() || undefined, times });
      setName(''); setDose(''); setTimes(['08:00']);
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <input className="input" placeholder="Nom (ex: Paracétamol)" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-row">
        <input className="input" placeholder="Dose (ex: 500mg)" value={dose} onChange={e => setDose(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 6 }} className="small">Horaires</div>
        {times.map((t, i) => (
          <div key={i} className="form-row">
            <input type="time" className="input" value={t} onChange={e => updateTime(i, e.target.value)} />
            <button type="button" className="btn" onClick={() => removeTime(i)}>Suppr</button>
          </div>
        ))}
        <div style={{ marginTop: 6 }}>
          <button type="button" className="btn" onClick={addTime}>Ajouter horaire</button>
        </div>
      </div>

      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
      <div>
        <button className="btn primary" disabled={loading}>{loading ? 'Ajout...' : 'Ajouter'}</button>
      </div>
    </form>
  );
}
