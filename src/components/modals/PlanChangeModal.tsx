import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Plan } from '../../types';
import confetti from 'canvas-confetti';

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  billingCycle: 'monthly' | 'annual';
}

export const PlanChangeModal: React.FC<PlanChangeModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
}) => {
  const { changePlan, currentMember } = useGym();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !plan) return null;

  const price = billingCycle === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      await changePlan(plan, billingCycle);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c3f400', '#fb5b1b'],
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const isCurrentPlan = currentMember.planId === plan.id;

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
            CAMBIO DE MEMBRESÍA
          </span>
        </div>
        <h3 className="font-condensed text-[24px] font-extrabold uppercase text-white tracking-wide">
          {plan.name}
        </h3>
        <p className="text-xs text-[#c4c9ac] font-inter">{plan.description}</p>

        <div className="my-4 p-3 bg-[#0c0e12] border border-[#444933]/40 rounded-xl flex items-baseline justify-between">
          <div>
            <span className="text-xs font-condensed uppercase text-[#c4c9ac] block">
              Cuota {billingCycle === 'annual' ? 'Anual (Pago Mensual -15%)' : 'Mensual'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-condensed text-[32px] font-extrabold text-[#c3f400]">
                {price.toFixed(2).replace('.', ',')} €
              </span>
              <span className="text-xs font-condensed uppercase text-[#c4c9ac]">/ MES</span>
            </div>
          </div>
          <span className="font-condensed text-xs uppercase px-2 py-0.5 rounded bg-[#333539] text-white">
            {plan.tag}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <span className="font-condensed text-xs uppercase text-[#c4c9ac] block font-semibold">
            Beneficios incluidos:
          </span>
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-white">
              <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0">check_circle</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div className="p-2.5 rounded-lg bg-[#111317] border border-white/5 text-[11px] text-[#c4c9ac] mb-4">
          <p>
            💳 Método de cobro: <strong className="text-white">{currentMember.paymentMethod}</strong>.
            Sin permanencia. Podrás modificar o pausar tu plan cuando quieras.
          </p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isUpdating || isCurrentPlan}
          className={`w-full py-2.5 rounded-lg font-condensed font-bold text-[16px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            isCurrentPlan
              ? 'bg-[#333539] text-[#c4c9ac] cursor-not-allowed'
              : 'bg-[#c3f400] text-[#111317] hover:brightness-110 active:scale-98'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>
            {isCurrentPlan
              ? 'Ya tienes este plan activo'
              : isUpdating
              ? 'Actualizando cuota...'
              : 'Confirmar y Activar Plan'}
          </span>
        </button>
      </div>
    </div>
  );
};
