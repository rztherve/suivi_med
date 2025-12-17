import cron from 'node-cron';
import Medication from '../models/medication.model';
import Notification from '../models/notification.model';
import User from '../models/user.model';
import { sendNotification } from './notificationSender';

/**
 * Scheduler qui génère les notifications pour les 24h suivantes.
 * Mode dev: toutes les minutes pour test rapide.
 */
export function startScheduler() {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('[scheduler] running job to generate notifications for next 24h');
      const now = new Date();
      const limit = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const users = await User.find().exec();

      for (const user of users) {
        const meds = await Medication.find({ user: user._id }).exec();

        for (const med of meds) {
          for (const t of med.times) {
            const [hh, mm] = t.split(':').map(Number);
            const scheduled = new Date(now);
            scheduled.setHours(hh, mm, 0, 0);
            if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);
            if (scheduled <= limit) {
              // éviter doublons
              const exists = await Notification.findOne({
                user: user._id,
                scheduledAt: scheduled,
                message: new RegExp(`Prendre ${escapeRegExp(med.name)}`, 'i')
              }).exec();
              if (!exists) {
                const message = `Prendre ${med.name}${med.dose ? ` (${med.dose})` : ''}`;
                const notif = new Notification({ user: user._id, scheduledAt: scheduled, message });
                await notif.save();
                // log pour dev / test
                await sendNotification(user.email, message, scheduled);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('[scheduler] error', err);
    }
  });
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
