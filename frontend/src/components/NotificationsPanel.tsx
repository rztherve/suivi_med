import React from 'react';
import type { Notification } from '../types';

export default function NotificationsPanel({ notifications, onMarkDone }: { notifications: Notification[]; onMarkDone: (id: string) => Promise<void> }) {
  if (!notifications || notifications.length === 0) return <div className="small">Aucune notification programmée.</div>;

  return (
    <div className="notifications">
      {notifications.map(n => (
        <div key={n.id} className="list-item" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{n.message}</div>
            <div className="small">{new Date(n.scheduledAt).toLocaleString()}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!n.done && <button className="btn primary" onClick={() => onMarkDone(n.id)}>Marquer comme prise</button>}
            {n.done && <div className="small">Pris ✓</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
