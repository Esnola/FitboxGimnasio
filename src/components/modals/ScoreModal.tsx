import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import confetti from 'canvas-confetti';

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExercise?: string;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onClose,
  defaultExercise = 'Murph Prep',
}) => {
  const { addNewPr } = useGym();
  const [exercise, setExercise] = useState(defaultExercise);
  const [minutes, setMinutes] = useState('21');
  const [seconds, setSeconds] = useState('45');
  const [weightKg, setWeightKg] = useState('45');
  const [reps, setReps] = useState('5');
  const [isRx, setIsRx] = useState(true);
  const [notes, setNotes] = useState('Completadas 5 rondas unbroken en los thrusters.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formattedNotes = `${isRx ? 'RX • ' : 'SCALED • '}Tiempo: ${minutes}:${seconds} min. ${notes}`;
      await addNewPr(exercise, parseFloat(weightKg) || 0, parseInt(reps, 10) || 1, formattedNotes);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c3f400', '#fb5b1b', '#00dbe9'],
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e2024] border border-[#c3f400]/40 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-left relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#333539] text-[#e2e2e8] flex items-center justify-center hover:bg-[#c3f400] hover:text-[#111317] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 text-[#c3f400] mb-1">
          <span className="material-symbols-outlined text-[22px]">timer</span>
          <span className="font-condensed font-bold text-[14px] uppercase tracking-wider">
            REGISTRO OFICIAL DE MARCA
          </span>
        </div>
        <h3 className="font-condensed text-[24px] font-extrabold uppercase text-white tracking-wide">
          REGISTRAR SCORE WOD
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
              Nombre del WOD / Benchmark
            </label>
            <input
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              required
              className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-inter text-sm focus:border-[#c3f400] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
                Tiempo Final (Min : Seg)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="Min"
                  className="w-full bg-[#111317] border border-[#444933] rounded-lg px-2 py-2 text-white font-inter text-sm text-center focus:border-[#c3f400] focus:outline-none"
                />
                <span className="text-white font-bold">:</span>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="Seg"
                  className="w-full bg-[#111317] border border-[#444933] rounded-lg px-2 py-2 text-white font-inter text-sm text-center focus:border-[#c3f400] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
                Carga / Peso (KG)
              </label>
              <input
                type="number"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-inter text-sm text-center focus:border-[#c3f400] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-condensed uppercase text-[#c4c9ac]">Modalidad:</span>
            <button
              type="button"
              onClick={() => setIsRx(true)}
              className={`px-3 py-1 rounded text-xs font-condensed font-bold uppercase ${
                isRx ? 'bg-[#c3f400] text-[#111317]' : 'bg-[#333539] text-[#c4c9ac]'
              }`}
            >
              RX
            </button>
            <button
              type="button"
              onClick={() => setIsRx(false)}
              className={`px-3 py-1 rounded text-xs font-condensed font-bold uppercase ${
                !isRx ? 'bg-[#fb5b1b] text-white' : 'bg-[#333539] text-[#c4c9ac]'
              }`}
            >
              Scaled
            </button>
          </div>

          <div>
            <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
              Notas y Sensaciones
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-inter text-sm focus:border-[#c3f400] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-[16px] uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{isSubmitting ? 'Guardando en Box...' : 'Guardar y Publicar en Box'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
