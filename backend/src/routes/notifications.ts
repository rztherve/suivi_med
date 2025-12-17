import { Router } from 'express';
import Notification from '../models/notification.model';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// lister toutes les notifications de l'utilisateur
router.get('/', async (req: any, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ scheduledAt: 1 })
      .lean()
      .exec();
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? 'internal error' });
  }
});

// marquer une notification comme prise
router.post('/:id/done', async (req: any, res) => {
  try {
    const notif = await Notification.findOne({ _id: req.params.id, user: req.user._id }).exec();
    if (!notif) return res.status(404).json({ error: 'not found' });
    notif.done = true;
    await notif.save();
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? 'internal error' });
  }
});

export default router;
