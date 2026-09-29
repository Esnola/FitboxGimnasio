import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Member, GymClass, Plan, Booking, PrRecord, Receipt } from '../types';

export const INITIAL_MEMBER: Member = {
  uid: 'alex-mendoza-demo',
  name: 'Alex Mendoza',
  email: 'alex.mendoza@fitbox.club',
  memberId: '#FB-8942',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-fRYjq9mEKCj76LB96WcXEgdk0qRvDbl5jzZOMOzqIPPqN-lLpoat8dJy5a_AY289-RSQarjWUQhM9kVpxprUqgkaoOu8dq60R0vVaLSAv-d42qV5hGU4w8_wK5blImUkh_94fn1qxRTRsdzXo3MkEt5jtblfiaRAm7tmKQWsUypEeMp3TLmDUELHI3lD4lczJzITGZdwOZ-XIUbJo_EcsZxYgAep-PSd25WXSkc-5pYO7Elo6jZ2A',
  level: 'RX',
  planId: 'plan-rx',
  planName: 'Plan Atleta Ilimitado RX',
  planExpiry: '2025-12-31',
  planStatus: 'active',
  paymentMethod: 'VISA •••• 4291',
  paymentExpiry: '09/27',
  weightKg: 78.4,
  heightCm: 178,
  bodyFatPercent: 13.5,
  emergencyContact: 'Laura Mendoza (+34 612 998 112)',
  medicalCertificateValidUntil: 'Nov 2025',
  monthlyAttendances: 18,
  streakDays: 12,
  classReminders: true,
  healthSync: true,
};

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-basico',
    name: 'PLAN BÁSICO',
    tag: '3 DÍAS/SEM',
    priceMonthly: 49.00,
    priceAnnualMonthly: 41.65,
    description: '3 clases semanales + Open Box regulado',
    features: [
      '3 clases semanales a elegir',
      'Acceso a Open Box en horario valle',
      'Reserva con 48h de antelación',
      'App de registro de marcas básica',
    ],
  },
  {
    id: 'plan-rx',
    name: 'PLAN ILIMITADO RX',
    tag: 'MÁS POPULAR',
    priceMonthly: 69.00,
    priceAnnualMonthly: 58.65,
    description: 'Clases y Open Box sin límites todos los días',
    features: [
      'Acceso ilimitado a todas las clases y horarios',
      'Acceso libre a Open Box ilimitado',
      'Reserva anticipada con 7 días de antelación',
      'Seguimiento de WODs y PRs ilimitado',
      '1 Invitación mensual para un amigo',
      'Descuento del 10% en cafetería y suplementos',
    ],
    isPopular: true,
    highlight: 'TU PLAN ACTUAL',
  },
  {
    id: 'plan-elite',
    name: 'PLAN ELITE PRO',
    tag: 'MÁXIMO RENDIMIENTO',
    priceMonthly: 95.00,
    priceAnnualMonthly: 80.75,
    description: 'Todo lo ilimitado + Asesoría Nutricional bimensual + 1 Sesión de Fisioterapia y Descarga mensual.',
    features: [
      'Todo lo incluido en el Plan Ilimitado RX',
      'Asesoría nutricional bimensual con dietista deportivo',
      '1 Sesión mensual de fisioterapia / descarga muscular',
      'Prioridad de reserva slot VIP en competiciones internas',
      'Toalla y servicio de taquilla privada incluida',
      '2 Invitaciones mensuales para amigos',
    ],
    highlight: '+ ASESORÍA Y FISIO',
  },
];

export const INITIAL_RECEIPTS: Receipt[] = [
  {
    id: 'rec-2025-03',
    memberId: 'alex-mendoza-demo',
    title: 'Cuota Mensual RX',
    amount: 69.00,
    date: '5 Mar 2025',
    paymentMethod: 'Visa 4291',
    status: 'paid',
  },
  {
    id: 'rec-2025-02',
    memberId: 'alex-mendoza-demo',
    title: 'Cuota Mensual RX',
    amount: 69.00,
    date: '5 Feb 2025',
    paymentMethod: 'Visa 4291',
    status: 'paid',
  },
  {
    id: 'rec-2025-01',
    memberId: 'alex-mendoza-demo',
    title: 'Cuota Mensual RX',
    amount: 69.00,
    date: '5 Ene 2025',
    paymentMethod: 'Visa 4291',
    status: 'paid',
  },
];

export const INITIAL_PRS: PrRecord[] = [
  {
    id: 'pr-clean-jerk',
    memberId: 'alex-mendoza-demo',
    exercise: 'Clean & Jerk',
    weightKg: 102.5,
    reps: 1,
    date: '14 Oct 2024',
    notes: 'Superado el club de los 100kg! Validado por Coach Marcos.',
  },
  {
    id: 'pr-snatch',
    memberId: 'alex-mendoza-demo',
    exercise: 'Snatch',
    weightKg: 85.0,
    reps: 1,
    date: '20 Sep 2024',
    notes: 'Mejor posición en la recepción profunda.',
  },
  {
    id: 'pr-back-squat',
    memberId: 'alex-mendoza-demo',
    exercise: 'Back Squat',
    weightKg: 145.0,
    reps: 3,
    date: '02 Oct 2024',
    notes: 'Serie pesada 3RM sólida.',
  },
  {
    id: 'pr-deadlift',
    memberId: 'alex-mendoza-demo',
    exercise: 'Deadlift',
    weightKg: 175.0,
    reps: 1,
    date: '28 Sep 2024',
    notes: 'Agarre mixto sin correas.',
  },
  {
    id: 'pr-murph',
    memberId: 'alex-mendoza-demo',
    exercise: 'Murph (Con chaleco)',
    weightKg: 9.0,
    reps: 1,
    date: '15 Ago 2024',
    notes: 'Tiempo final: 41m 20s RX.',
  },
];

export function getSampleClasses(): GymClass[] {
  const days = [
    { day: '24', dow: 'LUN', dateStr: '2024-10-24' },
    { day: '25', dow: 'MAR', dateStr: '2024-10-25' },
    { day: '26', dow: 'MIÉ', dateStr: '2024-10-26' },
    { day: '27', dow: 'JUE', dateStr: '2024-10-27' },
    { day: '28', dow: 'VIE', dateStr: '2024-10-28' },
    { day: '29', dow: 'SÁB', dateStr: '2024-10-29' },
    { day: '30', dow: 'DOM', dateStr: '2024-10-30' },
  ];

  const classes: GymClass[] = [];

  days.forEach(({ day, dow, dateStr }) => {
    // 07:00
    classes.push({
      id: `class-${day}-0700`,
      title: 'CROSSFIT WOD',
      category: 'crossfit',
      location: 'Box Principal',
      coachName: 'Coach Laura M.',
      coachInitials: 'LM',
      startTime: '07:00',
      endTime: '08:00',
      durationMinutes: 60,
      date: dateStr,
      dayOfWeek: dow,
      intensity: 'Alta',
      sublabel: 'WOD del día programado',
      maxCapacity: 16,
      bookedCount: 16,
      waitlistCount: 2,
    });

    // 10:00
    classes.push({
      id: `class-${day}-1000`,
      title: 'FUNCIONAL & HIIT',
      category: 'endurance',
      location: 'Zona HIIT',
      coachName: 'Coach David K.',
      coachInitials: 'DK',
      startTime: '10:00',
      endTime: '11:00',
      durationMinutes: 60,
      date: dateStr,
      dayOfWeek: dow,
      intensity: 'Alta',
      sublabel: 'Intervalos aeróbicos y metabólicos',
      maxCapacity: 16,
      bookedCount: 8,
      waitlistCount: 0,
    });

    // 14:00
    classes.push({
      id: `class-${day}-1400`,
      title: 'OPEN BOX LIBRE',
      category: 'openbox',
      location: 'Pista Libre',
      coachName: 'Sin coach asignado (Autónomo)',
      coachInitials: 'OB',
      startTime: '14:00',
      endTime: '15:30',
      durationMinutes: 90,
      date: dateStr,
      dayOfWeek: dow,
      intensity: 'Libre',
      sublabel: 'Práctica de técnica y fuerza libre',
      maxCapacity: 20,
      bookedCount: 8,
      waitlistCount: 0,
    });

    // 18:30 (On Tuesday 25th, booked by Alex Mendoza)
    classes.push({
      id: `class-${day}-1830`,
      title: 'CROSSFIT COMPETICIÓN',
      category: 'crossfit',
      location: 'Box Principal',
      coachName: 'Coach Marcos R.',
      coachInitials: 'MR',
      startTime: '18:30',
      endTime: '19:30',
      durationMinutes: 60,
      date: dateStr,
      dayOfWeek: dow,
      intensity: 'Muy Alta',
      sublabel: 'Avanzado / Pro',
      maxCapacity: 16,
      bookedCount: 15,
      waitlistCount: 0,
    });

    // 19:45
    classes.push({
      id: `class-${day}-1945`,
      title: 'HALTEROFILIA / OLY',
      category: 'halterofilia',
      location: 'Tarima Oly',
      coachName: 'Coach Elena V.',
      coachInitials: 'EV',
      startTime: '19:45',
      endTime: '20:45',
      durationMinutes: 60,
      date: dateStr,
      dayOfWeek: dow,
      intensity: 'Snatch + Clean & Jerk',
      sublabel: 'Técnica de arrancada y dos tiempos',
      maxCapacity: 12,
      bookedCount: 8,
      waitlistCount: 0,
    });

    // 21:00
    classes.push({
      id: `class-${day}-2100`,
      title: 'MOBILITY & STRETCH',
      category: 'mobility',
      location: 'Sala Mobility',
      coachName: 'Coach Laura M.',
      coachInitials: 'LM',
      startTime: '21:00',
      endTime: '22:00',
      durationMinutes: 60,
      date: dateStr,
      dayOfWeek: dow,
      intensity: 'Recuperación miofascial',
      sublabel: 'Flexibilidad y liberación muscular',
      maxCapacity: 15,
      bookedCount: 5,
      waitlistCount: 0,
    });
  });

  return classes;
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-alex-25-1830',
    classId: 'class-25-1830',
    memberId: 'alex-mendoza-demo',
    memberName: 'Alex Mendoza',
    classTitle: 'CROSSFIT COMPETICIÓN',
    classTime: '18:30 - 19:30',
    classDate: '2024-10-25',
    boxPassCode: '#4920',
    status: 'confirmed',
    createdAt: '2024-10-24T18:00:00.000Z',
  },
  {
    id: 'booking-alex-26-1945',
    classId: 'class-26-1945',
    memberId: 'alex-mendoza-demo',
    memberName: 'Alex Mendoza',
    classTitle: 'HALTEROFILIA / OLY',
    classTime: '19:45 - 20:45',
    classDate: '2024-10-26',
    boxPassCode: '#5184',
    status: 'confirmed',
    createdAt: '2024-10-24T19:00:00.000Z',
  },
  {
    id: 'booking-alex-24-0700',
    classId: 'class-24-0700',
    memberId: 'alex-mendoza-demo',
    memberName: 'Alex Mendoza',
    classTitle: 'CROSSFIT WOD',
    classTime: '07:00 - 08:00',
    classDate: '2024-10-24',
    boxPassCode: '#3890',
    status: 'confirmed',
    createdAt: '2024-10-23T10:00:00.000Z',
  },
  {
    id: 'booking-alex-22-1000',
    classId: 'class-22-1000',
    memberId: 'alex-mendoza-demo',
    memberName: 'Alex Mendoza',
    classTitle: 'FUNCIONAL & HIIT',
    classTime: '10:00 - 11:00',
    classDate: '2024-10-22',
    boxPassCode: '#2910',
    status: 'confirmed',
    createdAt: '2024-10-21T09:30:00.000Z',
  },
  {
    id: 'booking-alex-20-1400',
    classId: 'class-20-1400',
    memberId: 'alex-mendoza-demo',
    memberName: 'Alex Mendoza',
    classTitle: 'OPEN BOX LIBRE',
    classTime: '14:00 - 15:30',
    classDate: '2024-10-20',
    boxPassCode: '#1182',
    status: 'confirmed',
    createdAt: '2024-10-19T14:10:00.000Z',
  },
];

export async function seedInitialDatabaseIfEmpty() {
  try {
    const plansSnap = await getDocs(collection(db, 'plans'));
    if (plansSnap.empty) {
      console.log('Seeding initial plans...');
      const batch = writeBatch(db);
      INITIAL_PLANS.forEach(plan => {
        batch.set(doc(db, 'plans', plan.id), plan);
      });
      await batch.commit();
    }

    const memberRef = doc(db, 'members', INITIAL_MEMBER.uid);
    await setDoc(memberRef, INITIAL_MEMBER, { merge: true });

    const classesSnap = await getDocs(collection(db, 'classes'));
    if (classesSnap.empty) {
      console.log('Seeding initial classes...');
      const sampleClasses = getSampleClasses();
      const batch = writeBatch(db);
      sampleClasses.forEach(c => {
        batch.set(doc(db, 'classes', c.id), c);
      });
      await batch.commit();
    }

    const bookingsSnap = await getDocs(collection(db, 'bookings'));
    if (bookingsSnap.empty || bookingsSnap.size < INITIAL_BOOKINGS.length) {
      console.log('Seeding initial bookings...');
      const batch = writeBatch(db);
      INITIAL_BOOKINGS.forEach(b => {
        batch.set(doc(db, 'bookings', b.id), b, { merge: true });
      });
      await batch.commit();
    }

    const prsSnap = await getDocs(collection(db, 'prs'));
    if (prsSnap.empty) {
      console.log('Seeding initial PRs...');
      const batch = writeBatch(db);
      INITIAL_PRS.forEach(pr => {
        batch.set(doc(db, 'prs', pr.id), pr);
      });
      await batch.commit();
    }

    const receiptsSnap = await getDocs(collection(db, 'receipts'));
    if (receiptsSnap.empty) {
      console.log('Seeding initial receipts...');
      const batch = writeBatch(db);
      INITIAL_RECEIPTS.forEach(r => {
        batch.set(doc(db, 'receipts', r.id), r);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}
