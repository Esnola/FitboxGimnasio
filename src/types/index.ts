export interface Member {
  uid: string;
  name: string;
  email: string;
  memberId: string;
  avatarUrl: string;
  level: 'RX' | 'SCALED' | 'PRO';
  planId: string;
  planName: string;
  planExpiry: string;
  planStatus: 'active' | 'paused' | 'expired';
  paymentMethod: string;
  paymentExpiry: string;
  weightKg: number;
  heightCm: number;
  bodyFatPercent: number;
  emergencyContact: string;
  medicalCertificateValidUntil: string;
  monthlyAttendances: number;
  streakDays: number;
  classReminders: boolean;
  healthSync: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ClassCategory = 'crossfit' | 'halterofilia' | 'endurance' | 'openbox' | 'mobility';

export interface GymClass {
  id: string;
  title: string;
  category: ClassCategory;
  location: string;
  coachName: string;
  coachInitials: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // LUN, MAR, etc.
  intensity: string;
  sublabel: string;
  maxCapacity: number;
  bookedCount: number;
  waitlistCount: number;
}

export interface Booking {
  id: string;
  classId: string;
  memberId: string;
  memberName: string;
  classTitle: string;
  classTime: string;
  classDate: string;
  boxPassCode: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  tag: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  highlight?: string;
}

export interface PrRecord {
  id: string;
  memberId: string;
  exercise: string;
  weightKg: number;
  reps: number;
  date: string;
  notes?: string;
}

export interface Receipt {
  id: string;
  memberId: string;
  title: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'paid' | 'pending';
}
