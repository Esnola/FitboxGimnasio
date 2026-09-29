import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { ClassesScreen } from './screens/ClassesScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MembershipScreen } from './screens/MembershipScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WodPrsScreen } from './screens/WodPrsScreen';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/modals/AuthModal';

function MainAppShell() {
  const { activeTab, isLoading } = useGym();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111317] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#c3f400] border-t-transparent animate-spin"></div>
          <span className="material-symbols-outlined text-[#c3f400] text-2xl absolute inset-0 flex items-center justify-center">
            fitness_center
          </span>
        </div>
        <div>
          <h2 className="font-condensed text-2xl font-bold uppercase tracking-wider text-white">
            FITBOX CLUB
          </h2>
          <p className="font-inter text-xs text-[#c4c9ac] mt-1">
            Conectando con Firestore y cargando programación...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#111317] relative flex flex-col shadow-2xl selection:bg-[#c3f400] selection:text-[#111317]">
      {/* Dynamic Screen View */}
      {activeTab === 'inicio' && <HomeScreen onOpenAuth={() => setShowAuthModal(true)} />}
      {activeTab === 'clases' && <ClassesScreen onOpenAuth={() => setShowAuthModal(true)} />}
      {activeTab === 'wod' && <WodPrsScreen />}
      {activeTab === 'cuota' && <MembershipScreen onOpenAuth={() => setShowAuthModal(true)} />}
      {activeTab === 'perfil' && <ProfileScreen onOpenAuth={() => setShowAuthModal(true)} />}

      {/* Persistent Bottom Nav Bar */}
      <BottomNav />

      {/* Global Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <MainAppShell />
    </GymProvider>
  );
}
