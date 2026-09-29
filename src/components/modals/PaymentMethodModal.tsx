import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isOpen, onClose }) => {
  const { updatePaymentMethod } = useGym();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('Alex Mendoza');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4) || '8842';
      await updatePaymentMethod(last4, expiry || '12/28');
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
          <span className="material-symbols-outlined text-[22px]">credit_card</span>
          <span className="font-condensed font-bold text-[14px] uppercase tracking-wider">
            MÉTODO DE PAGO
          </span>
        </div>
        <h3 className="font-condensed text-[24px] font-extrabold uppercase text-white tracking-wide">
          CAMBIAR TARJETA
        </h3>
        <p className="text-xs text-[#c4c9ac] font-inter">
          Tus datos se transmiten encriptados mediante protocolo seguro SSL.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
              Titular de la tarjeta
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
              className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-inter text-sm focus:border-[#c3f400] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
              Número de Tarjeta (16 dígitos)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="4500 1234 5678 4291"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                  setCardNumber(val);
                }}
                required
                className="w-full bg-[#111317] border border-[#444933] rounded-lg pl-3 pr-10 py-2 text-white font-mono text-sm focus:border-[#c3f400] focus:outline-none"
              />
              <span className="material-symbols-outlined text-[20px] text-[#c4c9ac] absolute right-3 top-2.5">
                credit_card
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
                Caducidad (MM/AA)
              </label>
              <input
                type="text"
                placeholder="09/27"
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-mono text-sm text-center focus:border-[#c3f400] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">
                CVV (3 dígitos)
              </label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                className="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white font-mono text-sm text-center focus:border-[#c3f400] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-[16px] uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Nueva Tarjeta'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
