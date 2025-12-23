import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions }  from 'cors';
import authRoutes from './routes/auth';
import medsRoutes from './routes/meds';
import notificationsRoutes from './routes/notifications';
import cookieParser from 'cookie-parser';

const app = express();

/**
 * -------------------------
 * 🔧 Configuration CORS
 * -------------------------
 * En dev : autoriser tout (localhost)
 * En prod : restreindre à ton domaine
 */
const allowedOrigins = [
  'http://localhost:5173', // vite (frontend)
  'http://localhost:3000', // autre port possible
  process.env.FRONTEND_URL, // pour déploiement
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Autoriser si pas d’origine (Postman, serveur local)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Sinon refuser
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // autorise cookies / headers d'auth
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * -------------------------
 * 🧩 Routes principales
 * -------------------------
 */
app.use('/api/auth', authRoutes);
app.use('/api/meds', medsRoutes);
app.use('/api/notifications', notificationsRoutes);

/**
 * -------------------------
 * 🧭 Route racine
 * -------------------------
 */
app.get('/', (req, res) => {
  res.json({
    message: 'API Suivi de Médicaments',
    status: 'running',
  });
});

/**
 * -------------------------
 * ⚠️ Gestion globale des erreurs
 * -------------------------
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  });
});


export default app;
