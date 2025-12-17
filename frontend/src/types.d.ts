export interface Medication {
  id: string;
  name: string;
  dose?: string | null;
  times: string[]; // ["08:00","20:00"]
  createdAt?: string;
}

export interface Notification {
  id: string;
  scheduledAt: string;
  message: string;
  done: boolean;
  createdAt?: string;
}
