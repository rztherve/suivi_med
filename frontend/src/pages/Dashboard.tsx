import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeds, addMed, deleteMed, getNotifications, markNotificationDone, logout as apiLogout  } from '../services/api';
import type { Medication, Notification } from '../types';
import MedicationForm from '../components/MedicationForm';
import MedicationList from '../components/MedicationList';
import NotificationsPanel from '../components/NotificationsPanel';

export default function Dashboard() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  /*useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) nav("/login");
  }, [nav]);*/

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const m = await getMeds();
      setMeds(m);
      const n = await getNotifications();
      setNotifications(n);
    } catch (err: any) {
      // si token invalide -> rediriger vers login
      console.error(err);
      if (err.message === 'No token' || err.message.toLowerCase().includes('token')) {
        // localStorage.removeItem('token');
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        nav('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [nav]);

  useEffect(() => { load(); }, [load]);

  // polling notifications every 30s (utile en dev)
  useEffect(() => {
    const t = setInterval(() => {
      getNotifications().then(setNotifications).catch(console.error);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  async function onAddMed(payload: { name: string; dose?: string; times: string[] }) {
    await addMed(payload);
    await load();
  }

  async function onDelete(id: string) {
    await deleteMed(id);
    await load();
  }

  async function onMarkDone(id: string) {
    await markNotificationDone(id);
    // Mise à jour rapide de l'état local pour un meilleur UX
    setNotifications(prev => prev.map(n => 
        (n as any).id === id ? { ...n, done: true } : n
    ));
    // await load();
  }

  async function logout() {
    //localStorage.removeItem('token');
    //nav('/login');
    try {
        // Await va attendre que la Promesse de l'API soit résolue (succès ou échec)
        await apiLogout(); 
    } catch (err) {
        // On peut logger l'erreur mais on continue la redirection
        console.error("Logout API failed, but redirecting anyway:", err);
    } finally {
        // Le code ici s'exécute après la fin de la Promesse (try ou catch)
        nav('/login'); 
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Suivi de Médicaments</h2>
        <div>
          <button className="btn" onClick={load} disabled={loading}>Rafraîchir</button>{' '}
          <button className="btn" onClick={logout}>Se déconnecter</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h3>Notifications</h3>
        <NotificationsPanel notifications={notifications} onMarkDone={onMarkDone} />
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h3>Ajouter un médicament</h3>
        <MedicationForm onSubmit={onAddMed} />
      </div>

      <div className="card">
        <h3>Mes médicaments</h3>
        <MedicationList meds={meds} onDelete={onDelete} />
      </div>

    </div>
  );
}
