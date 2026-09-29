import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { ScoreModal } from '../components/modals/ScoreModal';

export const WodPrsScreen: React.FC = () => {
  const { prs } = useGym();
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedLift1RM, setSelectedLift1RM] = useState<number>(102.5);
  const [selectedLiftName, setSelectedLiftName] = useState<string>('Clean & Jerk');

  const percentages = [50, 60, 70, 75, 80, 85, 90, 95];

  return (
    <div className="min-h-screen bg-[#111317] text-[#e2e2e8] pb-28 relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#111317]/95 backdrop-blur-md border-b border-[#444933]/30 px-4 py-3 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1e2024] flex items-center justify-center text-[#c3f400]">
            <span className="material-symbols-outlined text-[20px]">fitness_center</span>
          </div>
          <div>
            <span className="text-[#c4c9ac] font-condensed text-[12px] uppercase block tracking-wider font-semibold">
              FITBOX BENCHMARKS
            </span>
            <h1 className="text-white font-condensed text-[24px] uppercase font-bold leading-none">
              WOD & RÉCORDS (PRS)
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowScoreModal(true)}
          className="py-1.5 px-3 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-xs uppercase flex items-center gap-1 hover:brightness-110 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Nuevo PR</span>
        </button>
      </header>

      <main className="px-4 pt-3 space-y-4">
        {/* Workout of the Day Highlight */}
        <section className="rounded-xl bg-[#1e2024] border border-[#444933]/40 p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[#c3f400] font-condensed text-xs uppercase font-bold tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              PROGRAMACIÓN DEL DÍA
            </span>
            <span className="bg-[#fb5b1b]/20 text-[#ffb59d] border border-[#fb5b1b]/30 px-2 py-0.5 rounded font-condensed text-xs uppercase font-bold">
              Time Cap: 24'
            </span>
          </div>

          <div>
            <h2 className="font-condensed text-[28px] font-extrabold uppercase text-white tracking-wide">
              "MURPH PREP"
            </h2>
            <p className="font-inter text-xs text-[#c4c9ac]">
              5 Rondas intensivas por tiempo (For Time):
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-white/5">
              <span className="font-condensed text-2xl font-bold text-white block">15</span>
              <span className="font-condensed text-xs uppercase text-[#c4c9ac]">Pull-ups</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-white/5">
              <span className="font-condensed text-2xl font-bold text-white block">20</span>
              <span className="font-condensed text-xs uppercase text-[#c4c9ac]">Box Jumps</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-white/5">
              <span className="font-condensed text-2xl font-bold text-white block">15</span>
              <span className="font-condensed text-xs uppercase text-[#c4c9ac]">Thrusters 45kg</span>
            </div>
          </div>

          <button
            onClick={() => setShowScoreModal(true)}
            className="w-full py-2.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-extrabold text-[15px] uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>Registrar Score de Hoy</span>
          </button>
        </section>

        {/* 1RM Calculator Widget */}
        <section className="rounded-xl bg-[#1a1c20] border border-[#444933]/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00dbe9] text-[20px]">calculate</span>
              <h3 className="font-condensed text-[16px] uppercase font-bold text-white tracking-wider">
                Calculadora de Porcentajes 1RM
              </h3>
            </div>
            <span className="font-condensed text-xs text-[#00dbe9] uppercase font-bold">
              {selectedLiftName}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { name: 'Clean & Jerk', max: 102.5 },
              { name: 'Snatch', max: 85.0 },
              { name: 'Back Squat', max: 145.0 },
              { name: 'Deadlift', max: 175.0 },
            ].map((lift) => (
              <button
                key={lift.name}
                onClick={() => {
                  setSelectedLiftName(lift.name);
                  setSelectedLift1RM(lift.max);
                }}
                className={`px-3 py-1 rounded-full font-condensed text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                  selectedLiftName === lift.name
                    ? 'bg-[#00dbe9] text-[#111317] font-extrabold'
                    : 'bg-[#1e2024] text-[#c4c9ac] hover:text-white'
                }`}
              >
                {lift.name} ({lift.max}kg)
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {percentages.map((pct) => {
              const calculated = (selectedLift1RM * (pct / 100)).toFixed(1);
              return (
                <div key={pct} className="p-2 rounded bg-[#1e2024] border border-white/5 text-center">
                  <span className="font-condensed text-[11px] text-[#c4c9ac] uppercase block">
                    {pct}%
                  </span>
                  <span className="font-condensed text-[16px] font-bold text-white">
                    {calculated} <span className="text-[10px] text-[#8e9379]">kg</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* History of Personal Records */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-condensed text-[18px] uppercase font-bold text-white">
              Historial de Marcas Personales
            </h3>
            <span className="font-condensed text-xs text-[#c4c9ac] uppercase font-semibold">
              {prs.length} Registros Oficiales
            </span>
          </div>

          <div className="space-y-2">
            {prs.map((pr) => (
              <div
                key={pr.id}
                className="p-3 rounded-xl bg-[#1e2024] border border-[#444933]/30 flex items-center justify-between hover:border-[#c3f400]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-condensed text-[17px] font-bold text-white uppercase">
                      {pr.exercise}
                    </h4>
                    <span className="font-condensed text-[11px] uppercase bg-[#c3f400]/20 text-[#c3f400] px-1.5 py-0.2 rounded font-bold">
                      PR
                    </span>
                  </div>
                  {pr.notes && (
                    <p className="font-inter text-xs text-[#c4c9ac] mt-0.5 max-w-[230px] truncate">
                      {pr.notes}
                    </p>
                  )}
                  <span className="font-condensed text-[11px] text-[#8e9379] uppercase block mt-0.5">
                    {pr.date}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-condensed text-[24px] font-extrabold text-[#c3f400] leading-none block">
                    {pr.weightKg} <span className="text-xs uppercase text-[#c4c9ac]">KG</span>
                  </span>
                  <span className="font-condensed text-[11px] text-[#c4c9ac] uppercase">
                    {pr.reps} {pr.reps === 1 ? 'Repetición' : 'Reps'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Score Modal */}
      {showScoreModal && (
        <ScoreModal isOpen={showScoreModal} onClose={() => setShowScoreModal(false)} />
      )}
    </div>
  );
};
