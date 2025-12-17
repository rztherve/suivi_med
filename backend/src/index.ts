import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './db';
import { startScheduler } from './services/scheduler';

const PORT = process.env.PORT ?? 4000;


const startServer = async () => {
    // 1. CONNEXION BLOQUANTE : ATTEND QUE LA DB SOIT PRÊTE
    await connectDB(); 
    
    // 2. DÉMARRAGE DU SCHEDULER : Maintenant, il peut interroger Mongoose
    startScheduler();

    // 3. DÉMARRAGE DU SERVEUR
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
};

startServer(); 
