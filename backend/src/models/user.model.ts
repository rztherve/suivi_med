import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface TypeScript représentant un utilisateur.
 * On étend Document pour inclure les méthodes Mongoose.
 */
export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  household?: string;
  createdAt?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Schéma Mongoose de l'utilisateur.
 * Inclut :
 * - Validation email unique
 * - Nettoyage des champs
 * - Timestamps automatiques
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    household: {
      type: String,
    },
  },
  {
    timestamps: true, // ajoute createdAt / updatedAt
    versionKey: false, // supprime le champ __v
  }
);

/**
 * Middleware : Hash du mot de passe avant sauvegarde.
 * Ne re-hash pas si le mot de passe n’a pas été modifié.
 */
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

/**
 * Méthode d'instance : comparaison de mot de passe.
 * Renvoie true si le mot de passe correspond, sinon false.
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>("User", userSchema);
