import React from 'react';
import { Receipt } from '../../types';
import { useGym } from '../../context/GymContext';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receipt }) => {
  const { currentMember } = useGym();
  if (!isOpen || !receipt) return null;

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
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span className="font-condensed font-bold text-[14px] uppercase tracking-wider">
            RECIBO DE CUOTA OFICIAL
          </span>
        </div>
        <h3 className="font-condensed text-[24px] font-extrabold uppercase text-white tracking-wide">
          FITBOX CLUB
        </h3>
        <p className="text-xs text-[#c4c9ac] font-inter">C.I.F. B-88921044 • Paseo de la Castellana 210, Madrid</p>

        <div className="my-4 p-4 bg-[#0c0e12] border border-[#444933]/40 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-[#c4c9ac] uppercase font-condensed">Nº Factura:</span>
            <span className="text-white font-mono">{receipt.id.toUpperCase()}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-[#c4c9ac] uppercase font-condensed">Fecha de Emisión:</span>
            <span className="text-white font-medium">{receipt.date}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-[#c4c9ac] uppercase font-condensed">Socio:</span>
            <span className="text-white font-medium">{currentMember.name} ({currentMember.memberId})</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-[#c4c9ac] uppercase font-condensed">Concepto:</span>
            <span className="text-white font-medium">{receipt.title}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-[#c4c9ac] uppercase font-condensed">Método de pago:</span>
            <span className="text-white font-medium">{receipt.paymentMethod}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold">
            <span className="text-[#c3f400] uppercase font-condensed text-base">TOTAL PAGADO:</span>
            <span className="text-[#c3f400] font-condensed text-xl">{receipt.amount.toFixed(2).replace('.', ',')} €</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-2.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-[15px] uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimir / PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-[#333539] text-white font-condensed font-bold text-[15px] uppercase tracking-wider hover:bg-[#444933] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
