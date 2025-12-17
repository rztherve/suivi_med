import express from "express";
import jwt from "jsonwebtoken";
import User  from "../models/user.model";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth"; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

// -----------------------------
// 🔒 Schémas de validation Zod
// -----------------------------
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  household: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Fonction commune pour créer et définir le cookie
function setAuthCookie(res: any, userId: string, email: string) {
    const token = jwt.sign({ id: userId, email: email }, JWT_SECRET, { expiresIn: '1d' });
    
    // Définition du cookie HttpOnly
    res.cookie('auth_token', token, { // Nom du cookie: 'auth_token'
        httpOnly: true, // Empêche l'accès par JS du côté client (protection XSS)
        secure: process.env.NODE_ENV === 'production', // N'envoyer que sur HTTPS en production
        sameSite: 'lax', // Bonne pratique pour la prévention CSRF
        maxAge: 24 * 60 * 60 * 1000 // Durée de vie du cookie (1 jour)
    });
    return token; // Renvoie le token au cas où on voudrait le logguer
}

// -----------------------------
// 🧾 POST /api/auth/register
// -----------------------------
router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { email, password, name, household } = parsed;

    // Vérifier si utilisateur existe déjà
    const existing = await User.findOne({ email }).exec();
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Créer utilisateur (le hash sera fait automatiquement dans le model)
    const user = new User({ email, password, name, household });
    await user.save();

    // Générer le token JWT
    setAuthCookie(res, user._id, user.email);

    res.status(201).json({
      message: "User registered successfully",      
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    console.error(err);
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
});

// -----------------------------
// 🔑 POST /api/auth/login
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    // Chercher utilisateur
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Vérifier mot de passe (comparePassword vient du modèle)
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Générer le token
    setAuthCookie(res, user._id, user.email);

    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    console.error(err);
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Server error during login" });
  }
});

// 👤 GET /api/auth/me (Route Protégée)
router.get("/me", authMiddleware, async (req, res) => { // <-- UTILISER authMiddleware ici
  
  if (!req.user) {
    // Ne devrait pas arriver si le middleware a réussi
    return res.status(401).json({ error: "Not authorized: User ID not found" });
  }
  
  try {
    // req.user est maintenant l'objet IUser grâce à l'implémentation du middleware
    const user = req.user; 

    res.json({
      message: "User data retrieved successfully",
      user: { id: user._id, email: user.email, name: user.name, household: user.household },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error retrieving user data" });
  }
});

// ROUTE : POST /auth/logout
router.post('/logout', (req, res) => {
    // Le nom du cookie doit correspondre à celui défini dans /login et /register ('auth_token')
    res.cookie('auth_token', '', { 
        expires: new Date(0), // Fait expirer le cookie immédiatement
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    // On peut aussi utiliser res.clearCookie('auth_token');
    
    res.json({ message: 'Déconnexion réussie. Cookie effacé.' });
});


export default router;
