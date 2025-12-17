import { Router } from 'express';
import Medication from '../models/medication.model';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authMiddleware);

const medSchema = z.object({
  name: z.string().min(1),
  dose: z.string().optional(),
  times: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1)
});

// lister
router.get('/', async (req: any, res) => {
  const meds = await Medication.find({ user: req.user._id }).sort({ createdAt: -1 }).lean().exec();
  res.json(meds);
});

// créer
router.post('/', async (req: any, res) => {
  try {
    const parsed = medSchema.parse(req.body);
    const med = new Medication({ name: parsed.name, dose: parsed.dose ?? null, times: parsed.times, user: req.user._id });
    await med.save();
    res.status(201).json(med);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? 'invalid input' });
  }
});

// supprimer
router.delete('/:id', async (req: any, res) => {
  const id = req.params.id;
  const med = await Medication.findOne({ _id: id, user: req.user._id }).exec();
  if (!med) return res.status(404).json({ error: 'not found' });
  await med.deleteOne();
  res.json({ ok: true });
});

export default router;
