import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
    //   localStorage.setItem('token', res.token);
      nav('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2>Connexion</h2>
        <p className="hint">Utilise test@example.com / 123456 pour tester rapidement (si tu as créé l'utilisateur).</p>
        <form onSubmit={submit}>
          <div className="form-row">
            <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-row">
            <input className="input" placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn primary" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
          </div>

          <p className="hint" style={{ marginTop: 10 }}>
            Pas encore de compte ?{' '}
            <a href="/register" style={{ color: 'var(--accent)' }}>
              Créer un compte
            </a>
          </p>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
