import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentMember, updateMemberProfile } = useGym();
  const [name, setName] = useState(currentMember.name);
  const [weightKg, setWeightKg] = useState(currentMember.weightKg.toString());
  const [heightCm, setHeightCm] = useState(currentMember.heightCm.toString());
  const [bodyFat, setBodyFat] = useState(currentMember.bodyFatPercent.toString());
  const [emergencyContact, setEmergencyContact] = useState(currentMember.emergencyContact);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateMemberProfile({
        name,
        weightKg: parseFloat(weightKg) || currentMember.weightKg,
        heightCm: parseFloat(heightCm) || currentMember.heightCm,
        bodyFatPercent: parseFloat(bodyFat) || currentMember.bodyFatPercent,
        emergencyContact,
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
          <span className="material-symbols-outlined text-[22px]">badge</span>
          <span className="font-condensed font-bold text-[14px] uppercase tracking-wider">
            FICHA DE ATLETA
          </span>
        </div>
        <h3 className="font-condensed text-[24px] font-extrabold uppercase text-white tracking-wide">
          EDITAR PERFIL Y DATOS
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-inter text-sm focus:border-[#c3f400] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
                Peso (KG)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-[#111317] border border-[#444933] rounded-lg px-2 py-2 text-white font-inter text-sm text-center focus:border-[#c3f400] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
                Altura (CM)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full bg-[#111317] border border-[#444933] rounded-lg px-2 py-2 text-white font-inter text-sm text-center focus:border-[#c3f400] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
                % Grasa
              </label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full bg-[#111317] border border-[#444933] rounded-lg px-2 py-2 text-white font-inter text-sm text-center focus:border-[#c3f400] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
              Contacto de Emergencia
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-inter text-sm focus:border-[#c3f400] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-[16px] uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
