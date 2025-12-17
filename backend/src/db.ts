import mongoose from 'mongoose';

// Nous allons utiliser l'URI injectée via process.env.MONGO_URI dans l'index.ts

/**
 * Fonction asynchrone qui établit la connexion à MongoDB.
 * Cette fonction est exportée et 'await'ée par src/index.ts
 */
const connectDB = async () => {
    // 1. Récupération de l'URI et fallback (même si dotenv.config() devrait la charger)
    const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/suivi-medicaments';

    if (!process.env.MONGO_URI) {
        console.warn('⚠️ MONGO_URI non définie. Utilisation de la valeur par défaut.');
    }
    
    try {
        mongoose.set('strictQuery', true);
        
        // 2. Utiliser await pour attendre la connexion
        await mongoose.connect(MONGO_URI);
        
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        // En cas d'échec de la connexion, le processus s'arrête
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); 
    }
};

// Exporter la fonction pour qu'elle soit appelée et attendue dans index.ts
export default connectDB;