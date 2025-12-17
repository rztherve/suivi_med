// stub d'envoi (log). Remplace par nodemailer / push provider en prod
export async function sendNotification(userEmail: string, message: string, scheduledAt: Date) {
  console.log(`[notification] to=${userEmail} at=${scheduledAt.toISOString()} message=${message}`);
  // in prod, ici: call e.g. Nodemailer / Firebase push / external provider
}
