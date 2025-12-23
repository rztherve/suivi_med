// frontend/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password, name);
      nav('/login');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’inscription');
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <div className="card">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <button type="submit" className="btn primary" style={{ width: '100%' }}>
            S’inscrire
          </button>
          <p className="hint" style={{ marginTop: 10 }}>
            Déjà un compte ? <a href="/login">Se connecter</a>
          </p>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
