import type { Medication, Notification } from '../types';

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');

async function request<T>(path: string, method = 'GET', body?: any, withAuth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'charset':'utf-8' };
  /*if (withAuth) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    headers['Authorization'] = `Bearer ${token}`;
  }*/
  const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include', // ✅ NOUVEAU : Ajouter les credentials pour les cookies 
  };
  const res = await fetch(`${BASE}${path}`, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const errMsg = data?.error ?? data?.message ?? res.statusText;
    throw new Error(errMsg);
  }
  return data as T;
}

/* auth */
export async function login(email: string, password: string) {
  return request('/auth/login', 'POST', { email, password }, false);
}
export async function register(email: string, password: string, name?: string) {
  return request('/auth/register', 'POST', { email, password, name }, false);
}
// Fonction pour appeler la déconnexion et effacer le cookie côté serveur
export async function logout(): Promise<{ message: string }> {
  // La fonction request est utilisée. Le navigateur enverra automatiquement le cookie HttpOnly,
  // et le serveur l'effacera grâce à la route /auth/logout que nous avons implémentée.
  return request('/auth/logout', 'POST'); 
}

/* meds */
export async function getMeds(): Promise<Medication[]> {
  const data = await request<any[]>('/meds');
  
  // CORRECTION : Mappage de _id en id
  return data.map(med => ({
    id: med._id, // Transforme _id en id (string)
    name: med.name,
    dose: med.dose,
    times: med.times
    // Assurez-vous d'inclure toutes les autres propriétés nécessaires
  }));
}
export async function addMed(payload: { name: string; dose?: string; times: string[] }): Promise<Medication> {
  return request('/meds', 'POST', payload);
}
export async function deleteMed(id: string): Promise<{ ok: boolean }> {
  return request(`/meds/${id}`, 'DELETE');
}

/* notifications */
export async function getNotifications(): Promise<Notification[]> {
  const data = await request<any[]>('/notifications');
  
  // CORRECTION : Mappage de _id en id
  return data.map(notif => ({
    id: notif._id, // Transforme _id en id (string)
    // Assurez-vous que le reste du modèle est correctement mappé
    message: notif.message,
    scheduledAt: notif.scheduledAt,
    done: notif.done,
    // Autres propriétés...
  }));
}
export async function markNotificationDone(id: string): Promise<{ ok: boolean }> {
  return request(`/notifications/${id}/done`, 'POST');
}
