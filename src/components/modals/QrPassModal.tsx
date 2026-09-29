import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';

interface QrPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingInfo?: {
    classTitle: string;
    classTime: string;
    location?: string;
    coach?: string;
    boxPassCode?: string;
  };
}

export const QrPassModal: React.FC<QrPassModalProps> = ({ isOpen, onClose, bookingInfo }) => {
  const { currentMember } = useGym();
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(30);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const passCode = bookingInfo?.boxPassCode || `#${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e2024] border border-[#c3f400]/40 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-center relative neon-glow">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#333539] text-[#e2e2e8] flex items-center justify-center hover:bg-[#c3f400] hover:text-[#111317] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-1.5 text-[#c3f400] mb-1">
          <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
          <span className="font-condensed font-bold text-[14px] uppercase tracking-wider">
            {bookingInfo ? 'PASE DE ACCESO A CLASE' : 'CARNET DIGITAL DE ACCESO'}
          </span>
        </div>
        <h3 className="font-condensed text-[24px] font-extrabold uppercase text-white tracking-wide">
          {bookingInfo?.classTitle || 'TORNO BOX CENTRAL'}
        </h3>
        <p className="text-xs text-[#c4c9ac] font-inter">
          {bookingInfo ? `${bookingInfo.classTime} • ${bookingInfo.location || 'Box Principal'}` : 'Pista 04 • Acceso General'}
        </p>

        {/* QR Code graphic mockup */}
        <div className="my-5 p-4 bg-white rounded-xl inline-block shadow-inner mx-auto">
          <div className="w-44 h-44 grid grid-cols-6 gap-1 bg-[#0c0e12] p-2.5 rounded-lg">
            <div className="bg-white col-span-2 row-span-2 rounded-xs border border-black"></div>
            <div className="bg-[#c3f400] col-span-1 rounded-xs"></div>
            <div className="bg-white col-span-1"></div>
            <div className="bg-white col-span-2 row-span-2 rounded-xs border border-black"></div>

            <div className="bg-white col-span-1"></div>
            <div className="bg-[#c3f400] col-span-1"></div>

            <div className="bg-white col-span-1"></div>
            <div className="bg-[#c3f400] col-span-2"></div>
            <div className="bg-white col-span-1"></div>
            <div className="bg-white col-span-1"></div>
            <div className="bg-[#c3f400] col-span-1"></div>

            <div className="bg-white col-span-2"></div>
            <div className="bg-[#c3f400] col-span-1"></div>
            <div className="bg-white col-span-1"></div>
            <div className="bg-[#c3f400] col-span-2"></div>

            <div className="bg-white col-span-2 row-span-2 rounded-xs border border-black"></div>
            <div className="bg-[#c3f400] col-span-1"></div>
            <div className="bg-white col-span-1"></div>
            <div className="bg-white col-span-2"></div>

            <div className="bg-white col-span-2"></div>
          </div>
        </div>

        {/* Pass Token & Timer */}
        <div className="bg-[#0c0e12] border border-[#c3f400]/30 rounded-lg p-2.5 mb-4 flex items-center justify-between">
          <div className="text-left">
            <span className="font-condensed text-[11px] text-[#c4c9ac] uppercase block">TOKEN BOX-PASS</span>
            <span className="font-condensed text-[18px] text-[#c3f400] font-bold tracking-wider">{passCode}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#c3f400]">
            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
            <span className="font-condensed font-bold tracking-wider">{secondsLeft}s</span>
          </div>
        </div>

        {/* Athlete Info */}
        <div className="flex items-center justify-between text-xs text-[#c4c9ac] border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#333539] overflow-hidden">
              <img src={currentMember.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-medium">{currentMember.name}</span>
          </div>
          <span className="font-condensed text-[#c3f400] font-bold">{currentMember.memberId}</span>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-[16px] uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all"
        >
          Cerrar Pase
        </button>
      </div>
    </div>
  );
};
