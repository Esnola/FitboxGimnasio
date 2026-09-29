import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  increment,
  query,
  where,
  addDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Member, GymClass, Booking, Plan, PrRecord, Receipt } from '../types';
import { 
  INITIAL_MEMBER, 
  INITIAL_PLANS, 
  seedInitialDatabaseIfEmpty, 
  getSampleClasses 
} from '../lib/seedData';

interface GymContextType {
  authUser: User | null;
  currentMember: Member;
  classes: GymClass[];
  bookings: Booking[];
  plans: Plan[];
  prs: PrRecord[];
  receipts: Receipt[];
  isLoading: boolean;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  selectedCategory: string; // 'all' or specific category
  setSelectedCategory: (cat: string) => void;
  activeTab: 'inicio' | 'clases' | 'wod' | 'cuota' | 'perfil';
  setActiveTab: (tab: 'inicio' | 'clases' | 'wod' | 'cuota' | 'perfil') => void;
  // Actions
  reserveClass: (gymClass: GymClass) => Promise<{ success: boolean; message: string }>;
  cancelReservation: (classId: string) => Promise<{ success: boolean; message: string }>;
  joinWaitlist: (gymClass: GymClass) => Promise<{ success: boolean; message: string }>;
  leaveWaitlist: (classId: string) => Promise<{ success: boolean; message: string }>;
  changePlan: (newPlan: Plan, billingCycle: 'monthly' | 'annual') => Promise<void>;
  updateMemberProfile: (updates: Partial<Member>) => Promise<void>;
  addNewPr: (exercise: string, weightKg: number, reps: number, notes?: string) => Promise<void>;
  updatePaymentMethod: (cardEnding: string, expiry: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loadDemoUser: () => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [currentMember, setCurrentMember] = useState<Member>(INITIAL_MEMBER);
  const [classes, setClasses] = useState<GymClass[]>(getSampleClasses());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [prs, setPrs] = useState<PrRecord[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active filters and navigation state
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-25'); // Tuesday 25 Oct 2024 as in mockups
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'inicio' | 'clases' | 'wod' | 'cuota' | 'perfil'>('clases');

  // 1. Initial Database Seed on Mount
  useEffect(() => {
    async function initDb() {
      try {
        await seedInitialDatabaseIfEmpty();
      } catch (e) {
        console.warn('Initial seed check error:', e);
      }
    }
    initDb();
  }, []);

  // 2. Auth State Observer
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        // Load or create member in Firestore
        const memberRef = doc(db, 'members', user.uid);
        try {
          const defaultNewMember: Member = {
            uid: user.uid,
            name: user.displayName || 'Atleta FitBox',
            email: user.email || '',
            memberId: `#FB-${Math.floor(1000 + Math.random() * 9000)}`,
            avatarUrl: user.photoURL || INITIAL_MEMBER.avatarUrl,
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
            emergencyContact: 'Contacto de Emergencia (+34 600 000 000)',
            medicalCertificateValidUntil: 'Nov 2025',
            monthlyAttendances: 18,
            streakDays: 12,
            classReminders: true,
            healthSync: true,
          };
          await setDoc(memberRef, defaultNewMember, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `members/${user.uid}`);
        }
      } else {
        // Fallback to active demo member so the app is 100% interactive without login hurdles
        setCurrentMember(INITIAL_MEMBER);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 3. Realtime listener for Current Member
  useEffect(() => {
    const memberUid = authUser ? authUser.uid : INITIAL_MEMBER.uid;
    const unsubMember = onSnapshot(
      doc(db, 'members', memberUid),
      (snap) => {
        if (snap.exists()) {
          setCurrentMember(snap.data() as Member);
        } else {
          setCurrentMember(INITIAL_MEMBER);
        }
        setIsLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `members/${memberUid}`);
        setIsLoading(false);
      }
    );

    return () => unsubMember();
  }, [authUser]);

  // 4. Realtime listener for Classes
  useEffect(() => {
    const unsubClasses = onSnapshot(
      collection(db, 'classes'),
      (snap) => {
        if (!snap.empty) {
          const loadedClasses: GymClass[] = [];
          snap.forEach((d) => loadedClasses.push(d.data() as GymClass));
          // Sort by startTime
          loadedClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));
          setClasses(loadedClasses);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'classes');
      }
    );

    return () => unsubClasses();
  }, []);

  // 5. Realtime listener for Bookings
  useEffect(() => {
    const memberUid = authUser ? authUser.uid : INITIAL_MEMBER.uid;
    const q = query(collection(db, 'bookings'), where('memberId', '==', memberUid));
    const unsubBookings = onSnapshot(
      q,
      (snap) => {
        const loaded: Booking[] = [];
        snap.forEach((d) => {
          loaded.push({ ...d.data(), id: d.id } as Booking);
        });
        setBookings(loaded);
      },
      (error) => {
        // Also listen without where filter if rule requires
        const unsubAll = onSnapshot(
          collection(db, 'bookings'),
          (allSnap) => {
            const memberB: Booking[] = [];
            allSnap.forEach((d) => {
              const b = { ...d.data(), id: d.id } as Booking;
              if (b.memberId === memberUid) {
                memberB.push(b);
              }
            });
            setBookings(memberB);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, 'bookings')
        );
        return () => unsubAll();
      }
    );

    return () => unsubBookings();
  }, [authUser]);

  // 6. Realtime listener for Plans
  useEffect(() => {
    const unsubPlans = onSnapshot(
      collection(db, 'plans'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Plan[] = [];
          snap.forEach((d) => loaded.push(d.data() as Plan));
          setPlans(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'plans');
      }
    );

    return () => unsubPlans();
  }, []);

  // 7. Realtime listener for PRs
  useEffect(() => {
    const unsubPrs = onSnapshot(
      collection(db, 'prs'),
      (snap) => {
        if (!snap.empty) {
          const loaded: PrRecord[] = [];
          snap.forEach((d) => loaded.push(d.data() as PrRecord));
          setPrs(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'prs');
      }
    );

    return () => unsubPrs();
  }, []);

  // 8. Realtime listener for Receipts
  useEffect(() => {
    const unsubReceipts = onSnapshot(
      collection(db, 'receipts'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Receipt[] = [];
          snap.forEach((d) => loaded.push(d.data() as Receipt));
          setReceipts(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'receipts');
      }
    );

    return () => unsubReceipts();
  }, []);

  // --- ACTIONS ---

  // Reserve Class
  const reserveClass = async (gymClass: GymClass): Promise<{ success: boolean; message: string }> => {
    const memberUid = currentMember.uid;

    // Check if already booked
    const existing = bookings.find(
      (b) => b.classId === gymClass.id && b.status === 'confirmed'
    );
    if (existing) {
      return { success: false, message: 'Ya tienes una plaza reservada en esta clase.' };
    }

    if (gymClass.bookedCount >= gymClass.maxCapacity) {
      return { success: false, message: 'La clase está completa. Puedes unirte a la lista de espera.' };
    }

    try {
      const randomCode = `#${Math.floor(1000 + Math.random() * 9000)}`;
      const bookingData: Omit<Booking, 'id'> = {
        classId: gymClass.id,
        memberId: memberUid,
        memberName: currentMember.name,
        classTitle: gymClass.title,
        classTime: `${gymClass.startTime} - ${gymClass.endTime}`,
        classDate: gymClass.date,
        boxPassCode: randomCode,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);

      // Increment bookedCount in class
      const classRef = doc(db, 'classes', gymClass.id);
      await updateDoc(classRef, {
        bookedCount: increment(1),
      });

      // Update local state immediately for instant feedback
      setBookings((prev) => [...prev, { ...bookingData, id: docRef.id }]);
      setClasses((prev) =>
        prev.map((c) => (c.id === gymClass.id ? { ...c, bookedCount: c.bookedCount + 1 } : c))
      );

      return { success: true, message: `¡Plaza reservada con éxito! Tu pase es ${randomCode}` };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
      return { success: false, message: 'Error al reservar la clase en la base de datos.' };
    }
  };

  // Cancel Reservation
  const cancelReservation = async (classId: string): Promise<{ success: boolean; message: string }> => {
    const targetBooking = bookings.find((b) => b.classId === classId && b.status === 'confirmed');
    if (!targetBooking) {
      return { success: false, message: 'No se encontró una reserva activa para esta clase.' };
    }

    try {
      // Delete or update booking
      await deleteDoc(doc(db, 'bookings', targetBooking.id));

      // Decrement bookedCount in class
      const classRef = doc(db, 'classes', classId);
      await updateDoc(classRef, {
        bookedCount: increment(-1),
      });

      // Update local state
      setBookings((prev) => prev.filter((b) => b.id !== targetBooking.id));
      setClasses((prev) =>
        prev.map((c) =>
          c.id === classId ? { ...c, bookedCount: Math.max(0, c.bookedCount - 1) } : c
        )
      );

      return { success: true, message: 'Reserva cancelada correctamente. Tu cupo ha sido liberado.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bookings/${targetBooking.id}`);
      return { success: false, message: 'Error al cancelar la reserva.' };
    }
  };

  // Join Waitlist
  const joinWaitlist = async (gymClass: GymClass): Promise<{ success: boolean; message: string }> => {
    const memberUid = currentMember.uid;
    const existing = bookings.find(
      (b) => b.classId === gymClass.id && b.status === 'waitlist'
    );
    if (existing) {
      return { success: false, message: 'Ya te encuentras en la lista de espera de esta clase.' };
    }

    try {
      const bookingData: Omit<Booking, 'id'> = {
        classId: gymClass.id,
        memberId: memberUid,
        memberName: currentMember.name,
        classTitle: gymClass.title,
        classTime: `${gymClass.startTime} - ${gymClass.endTime}`,
        classDate: gymClass.date,
        boxPassCode: `ESPERA-${Math.floor(100 + Math.random() * 900)}`,
        status: 'waitlist',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);

      // Increment waitlist count in class
      const classRef = doc(db, 'classes', gymClass.id);
      await updateDoc(classRef, {
        waitlistCount: increment(1),
      });

      setBookings((prev) => [...prev, { ...bookingData, id: docRef.id }]);
      setClasses((prev) =>
        prev.map((c) => (c.id === gymClass.id ? { ...c, waitlistCount: c.waitlistCount + 1 } : c))
      );

      return { success: true, message: 'Te has unido a la lista de espera. Te avisaremos si se libera una plaza.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
      return { success: false, message: 'Error al unirse a la lista de espera.' };
    }
  };

  // Leave Waitlist
  const leaveWaitlist = async (classId: string): Promise<{ success: boolean; message: string }> => {
    const target = bookings.find((b) => b.classId === classId && b.status === 'waitlist');
    if (!target) return { success: false, message: 'No estás en la lista de espera.' };

    try {
      await deleteDoc(doc(db, 'bookings', target.id));
      const classRef = doc(db, 'classes', classId);
      await updateDoc(classRef, {
        waitlistCount: increment(-1),
      });

      setBookings((prev) => prev.filter((b) => b.id !== target.id));
      setClasses((prev) =>
        prev.map((c) =>
          c.id === classId ? { ...c, waitlistCount: Math.max(0, c.waitlistCount - 1) } : c
        )
      );

      return { success: true, message: 'Has salido de la lista de espera.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bookings/${target.id}`);
      return { success: false, message: 'Error al salir de la lista.' };
    }
  };

  // Change Member Plan
  const changePlan = async (newPlan: Plan, billingCycle: 'monthly' | 'annual'): Promise<void> => {
    try {
      const memberRef = doc(db, 'members', currentMember.uid);
      const updates = {
        planId: newPlan.id,
        planName: newPlan.name,
        planStatus: 'active' as const,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(memberRef, updates);
      setCurrentMember((prev) => ({ ...prev, ...updates }));

      // Also create a new receipt in history
      const price = billingCycle === 'annual' ? newPlan.priceAnnualMonthly : newPlan.priceMonthly;
      const newRec: Receipt = {
        id: `rec-${Date.now()}`,
        memberId: currentMember.uid,
        title: `Cambio a ${newPlan.name} (${billingCycle === 'annual' ? 'Anual' : 'Mensual'})`,
        amount: price,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        paymentMethod: currentMember.paymentMethod,
        status: 'paid',
      };
      await setDoc(doc(db, 'receipts', newRec.id), newRec);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `members/${currentMember.uid}`);
    }
  };

  // Update Member Profile
  const updateMemberProfile = async (updates: Partial<Member>): Promise<void> => {
    try {
      const memberRef = doc(db, 'members', currentMember.uid);
      await updateDoc(memberRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      setCurrentMember((prev) => ({ ...prev, ...updates }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `members/${currentMember.uid}`);
    }
  };

  // Update Payment Method
  const updatePaymentMethod = async (cardEnding: string, expiry: string): Promise<void> => {
    await updateMemberProfile({
      paymentMethod: `VISA •••• ${cardEnding}`,
      paymentExpiry: expiry,
    });
  };

  // Add new PR
  const addNewPr = async (exercise: string, weightKg: number, reps: number, notes?: string): Promise<void> => {
    try {
      const newPr: PrRecord = {
        id: `pr-${Date.now()}`,
        memberId: currentMember.uid,
        exercise,
        weightKg,
        reps,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        notes: notes || '',
      };
      await setDoc(doc(db, 'prs', newPr.id), newPr);
      setPrs((prev) => [newPr, ...prev]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'prs');
    }
  };

  // Sign In Google
  const signInGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign Out
  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthUser(null);
      setCurrentMember(INITIAL_MEMBER);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Switch to demo user
  const loadDemoUser = () => {
    setCurrentMember(INITIAL_MEMBER);
  };

  const value = useMemo(
    () => ({
      authUser,
      currentMember,
      classes,
      bookings,
      plans,
      prs,
      receipts,
      isLoading,
      selectedDate,
      setSelectedDate,
      selectedCategory,
      setSelectedCategory,
      activeTab,
      setActiveTab,
      reserveClass,
      cancelReservation,
      joinWaitlist,
      leaveWaitlist,
      changePlan,
      updateMemberProfile,
      addNewPr,
      updatePaymentMethod,
      signInGoogle,
      signOutUser,
      loadDemoUser,
    }),
    [
      authUser,
      currentMember,
      classes,
      bookings,
      plans,
      prs,
      receipts,
      isLoading,
      selectedDate,
      selectedCategory,
      activeTab,
    ]
  );

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
