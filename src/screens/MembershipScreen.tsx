import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Plan, Receipt } from '../types';
import { PlanChangeModal } from '../components/modals/PlanChangeModal';
import { PaymentMethodModal } from '../components/modals/PaymentMethodModal';
import { ReceiptModal } from '../components/modals/ReceiptModal';
import confetti from 'canvas-confetti';

interface MembershipScreenProps {
  onOpenAuth: () => void;
}

export const MembershipScreen: React.FC<MembershipScreenProps> = ({ onOpenAuth }) => {
  const { currentMember, plans, receipts } = useGym();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanForChange, setSelectedPlanForChange] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleGenerateGuestPass = () => {
    confetti({
      particleCount: 30,
      spread: 45,
      colors: ['#c3f400', '#ffffff'],
    });
    showToast('¡Invitación generada! Código amigo: #GUEST-BOX-2024');
  };

  return (
    <div className="min-h-screen bg-[#111317] text-[#e2e2e8] pb-28 relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1e2024] border border-[#c3f400] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-xs text-xs font-inter animate-bounce">
          <span className="material-symbols-outlined text-[#c3f400] text-[18px]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-[#1e2024]/90 backdrop-blur-md border-b border-[#444933]/30 flex justify-between items-center w-full px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="w-10 h-10 rounded-full overflow-hidden border border-[#444933]/50 relative bg-[#282a2e] flex items-center justify-center shrink-0 cursor-pointer hover:border-[#c3f400] transition-colors"
          >
            <img
              className="w-full h-full object-cover"
              alt="Avatar Atleta"
              src={currentMember.avatarUrl}
            />
          </button>
          <div>
            <span className="block font-condensed text-[13px] uppercase text-[#c4c9ac] tracking-wider font-semibold">
              FITBOX CLUB
            </span>
            <h1 className="font-condensed text-[24px] uppercase tracking-wider text-white font-bold leading-none">
              HOLA, ATLETA
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => receipts[0] && setSelectedReceipt(receipts[0])}
            aria-label="Historial de facturas"
            className="p-2 text-[#e2e2e8] hover:bg-[#333539] transition-colors rounded-full active:scale-95 cursor-pointer"
            title="Ver recibos"
          >
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </button>
          <button
            onClick={onOpenAuth}
            aria-label="Notificaciones"
            className="p-2 text-[#e2e2e8] hover:bg-[#333539] transition-colors rounded-full active:scale-95 relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c3f400] ring-2 ring-[#1e2024]"></span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS */}
      <main className="px-4 pt-3 space-y-5 flex-1">
        {/* Subheader Title */}
        <section className="flex items-center justify-between">
          <div>
            <span className="font-condensed text-[13px] uppercase text-[#c3f400] tracking-wider flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
              SUSCRIPCIÓN ACTIVA
            </span>
            <h2 className="font-condensed text-[28px] font-bold uppercase text-white leading-none mt-0.5">
              Mi Cuota y Membresía
            </h2>
          </div>
          <div className="text-right">
            <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase block">Socio</span>
            <span className="block font-condensed text-[16px] text-white tracking-wider font-extrabold">
              {currentMember.memberId}
            </span>
          </div>
        </section>

        {/* Digital Pass / Dark Metal Card */}
        <section className="relative overflow-hidden rounded-xl border border-[#444933]/40 bg-gradient-to-br from-[#282a2e] via-[#0c0e12] to-[#1a1c20] p-4 shadow-2xl">
          {/* Visual Accents */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#c3f400]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#fb5b1b]/10 rounded-full blur-xl pointer-events-none"></div>

          {/* Card Header: Brand & Chip */}
          <div className="flex items-start justify-between relative z-10 mb-5">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#c3f400] text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <div>
                <span className="font-condensed text-[24px] tracking-wider text-white uppercase leading-tight block font-bold">
                  FITBOX RX
                </span>
                <span className="font-condensed text-[13px] text-[#c3f400] uppercase tracking-widest font-semibold">
                  PERFORMANCE PASS
                </span>
              </div>
            </div>

            {/* Metallic chip representation */}
            <div className="w-11 h-8 rounded bg-gradient-to-tr from-[#333539] via-[#8e9379] to-[#333539] border border-[#8e9379]/50 flex flex-col justify-around p-1 shadow-inner opacity-90">
              <div className="h-0.5 w-full bg-[#0c0e12]/60"></div>
              <div className="h-0.5 w-3/4 bg-[#0c0e12]/60"></div>
              <div className="h-0.5 w-full bg-[#0c0e12]/60"></div>
            </div>
          </div>

          {/* Plan Name & Pricing */}
          <div className="relative z-10 mb-5">
            <span className="font-condensed text-[12px] uppercase text-[#c4c9ac] tracking-wider font-semibold">
              PLAN CONTRATADO
            </span>
            <div className="flex items-baseline justify-between mt-0.5">
              <h3 className="font-condensed text-[28px] font-extrabold uppercase text-white tracking-wide">
                {currentMember.planName}
              </h3>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-condensed text-[48px] font-extrabold text-white tracking-tight leading-none">
                {currentMember.planId === 'plan-elite'
                  ? '95,00'
                  : currentMember.planId === 'plan-basico'
                  ? '49,00'
                  : '69,00'}
              </span>
              <span className="font-condensed text-[16px] font-bold uppercase text-[#c4c9ac]">
                € / MES
              </span>
            </div>
          </div>

          {/* Card Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#444933]/30 text-xs relative z-10">
            <div>
              <span className="font-condensed text-[12px] uppercase text-[#c4c9ac] block font-semibold">
                ESTADO
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#c3f400]"></span>
                <span className="font-inter text-white font-semibold">Activa (Auto)</span>
              </div>
            </div>
            <div>
              <span className="font-condensed text-[12px] uppercase text-[#c4c9ac] block font-semibold">
                PRÓXIMO COBRO
              </span>
              <span className="font-inter text-white font-medium mt-0.5 block">
                5 de Noviembre, 2024
              </span>
            </div>
          </div>

          {/* Saved Payment Method */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between relative z-10 bg-[#0c0e12]/70 -mx-4 -mb-4 p-3 px-4 rounded-b-xl">
            <div className="flex items-center gap-2.5">
              <div className="px-2 py-1 rounded bg-[#282a2e] border border-[#444933]/30 flex items-center">
                <span className="material-symbols-outlined text-[18px] text-[#00dbe9]">
                  credit_card
                </span>
              </div>
              <div>
                <span className="font-condensed text-[13px] uppercase text-white block leading-tight font-bold">
                  {currentMember.paymentMethod}
                </span>
                <span className="font-condensed text-[12px] text-[#c4c9ac] leading-tight">
                  Expira {currentMember.paymentExpiry}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="font-condensed text-[13px] uppercase text-[#c3f400] font-bold tracking-wider hover:underline flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
            >
              <span>Cambiar</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Current Plan Inclusions / Benefits */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-condensed text-[24px] uppercase text-white font-bold">
              QUÉ INCLUYE TU PLAN ACTUAL
            </h4>
            <span className="font-condensed text-[12px] uppercase text-[#c3f400] bg-[#282a2e] px-2 py-0.5 rounded border border-[#444933]/30 font-bold">
              FULL ACCESS
            </span>
          </div>

          <div className="bg-[#1e2024] rounded-xl p-4 border border-[#444933]/20 space-y-3">
            {[
              {
                title: 'Acceso ilimitado a todas las clases y horarios',
                desc: 'WOD, Weightlifting, Gymnastics, Endurance',
              },
              {
                title: 'Acceso libre a Open Box ilimitado',
                desc: 'Lunes a Domingo según disponibilidad de carriles',
              },
              {
                title: 'Reserva anticipada con 7 días de antelación',
                desc: 'Prioridad de slot frente a planes básicos',
              },
              {
                title: 'Seguimiento de WODs y PRs ilimitado',
                desc: 'Métricas en tiempo real, porcentajes 1RM y gráficas',
              },
              {
                title: '1 Invitación mensual para un amigo',
                desc: 'Pase de 1 día libre canjeable en recepción',
                hasAction: true,
              },
              {
                title: 'Descuento del 10% en cafetería y suplementos',
                desc: 'Válido en Bar FitBox y tienda física',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-[#c3f400] text-xl shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <p className="font-inter text-sm text-white font-medium">{item.title}</p>
                    <p className="font-condensed text-[12px] uppercase text-[#c4c9ac]">{item.desc}</p>
                  </div>
                </div>
                {item.hasAction && (
                  <button
                    onClick={handleGenerateGuestPass}
                    className="px-2 py-1 rounded bg-[#333539] hover:bg-[#c3f400] hover:text-[#111317] text-[11px] font-condensed font-bold uppercase transition-colors shrink-0"
                  >
                    Enviar pase
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Plans Comparison & Upgrade Section */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-condensed text-[24px] uppercase text-white font-bold">
                CAMBIAR O MEJORAR PLAN
              </h4>
              <p className="font-condensed text-[12px] uppercase text-[#c4c9ac]">
                Flexibilidad total sin permanencia
              </p>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center p-1 rounded-lg bg-[#282a2e] border border-[#444933]/30 font-condensed text-[13px] uppercase">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
                  billingCycle === 'monthly'
                    ? 'bg-[#c3f400] text-[#111317] shadow-sm'
                    : 'text-[#c4c9ac] hover:text-white'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-bold ${
                  billingCycle === 'annual'
                    ? 'bg-[#c3f400] text-[#111317] shadow-sm'
                    : 'text-[#c4c9ac] hover:text-white'
                }`}
              >
                Anual -15%
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {plans.map((p) => {
              const isCurrent = currentMember.planId === p.id;
              const price = billingCycle === 'annual' ? p.priceAnnualMonthly : p.priceMonthly;

              if (p.id === 'plan-elite') {
                // Featured Upgrade Card
                return (
                  <div
                    key={p.id}
                    className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-b from-[#1e2024] to-[#282a2e] border border-[#fb5b1b]/40 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-condensed text-[13px] uppercase text-[#fb5b1b] font-bold tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">stars</span>
                        {p.tag}
                      </span>
                      <span className="font-condensed text-[12px] uppercase text-[#c4c9ac] bg-[#0c0e12] px-2 py-0.5 rounded border border-white/10 font-bold">
                        {p.highlight || '+ ASESORÍA Y FISIO'}
                      </span>
                    </div>

                    <h5 className="font-condensed text-[24px] uppercase text-white font-bold leading-tight">
                      {p.name}
                    </h5>
                    <p className="font-inter text-xs text-[#c4c9ac] mt-0.5">{p.description}</p>

                    <div className="flex items-baseline gap-1 my-2">
                      <span className="font-condensed text-[26px] text-white font-extrabold">
                        {price.toFixed(2).replace('.', ',')} €
                      </span>
                      <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">/ MES</span>
                    </div>

                    {isCurrent ? (
                      <div className="w-full py-2.5 rounded bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400] font-condensed font-bold text-[15px] uppercase tracking-wider text-center">
                        PLAN ACTIVO ACTUALMENTE
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedPlanForChange(p)}
                        className="w-full py-2.5 px-4 rounded bg-[#c3f400] text-[#111317] font-condensed font-extrabold text-[15px] uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                      >
                        <span>MEJORAR A PLAN ELITE</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                );
              }

              if (isCurrent) {
                // Card 2: Current Plan
                return (
                  <div
                    key={p.id}
                    className="bg-[#282a2e] rounded-xl p-4 border-2 border-[#c3f400] relative shadow-md"
                  >
                    <span className="absolute -top-3 right-4 bg-[#c3f400] text-[#111317] font-condensed text-[12px] uppercase font-extrabold px-2 py-0.5 rounded tracking-wider shadow-sm">
                      TU PLAN ACTUAL
                    </span>

                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-condensed text-[24px] uppercase text-white font-bold">
                            {p.name}
                          </span>
                          <span
                            className="material-symbols-outlined text-[#c3f400] text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            verified
                          </span>
                        </div>
                        <p className="font-inter text-xs text-[#c4c9ac] mt-0.5">{p.description}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-condensed text-[24px] text-[#c3f400] font-extrabold">
                            {price.toFixed(2).replace('.', ',')} €
                          </span>
                          <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">/ MES</span>
                        </div>
                      </div>

                      <span className="font-condensed text-[13px] uppercase text-[#c3f400] font-bold px-2.5 py-1 rounded bg-[#c3f400]/10 border border-[#c3f400]/20">
                        ACTIVO
                      </span>
                    </div>
                  </div>
                );
              }

              // Card 1: Other Plan (e.g. Plan Básico)
              return (
                <div
                  key={p.id}
                  className="bg-[#1e2024] rounded-xl p-4 border border-[#444933]/30 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-condensed text-[22px] uppercase text-white font-bold">
                        {p.name}
                      </span>
                      <span className="font-condensed text-[11px] text-[#c4c9ac] bg-[#282a2e] px-1.5 py-0.5 rounded font-semibold uppercase">
                        {p.tag}
                      </span>
                    </div>
                    <p className="font-inter text-xs text-[#c4c9ac] mt-0.5">{p.description}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-condensed text-[22px] text-white font-extrabold">
                        {price.toFixed(2).replace('.', ',')} €
                      </span>
                      <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">/ MES</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPlanForChange(p)}
                    className="px-3 py-2 rounded border border-[#8e9379] font-condensed text-[13px] uppercase text-white hover:bg-[#282a2e] active:scale-95 transition-all cursor-pointer font-bold"
                  >
                    Seleccionar
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Billing History Section */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="font-condensed text-[24px] uppercase text-white font-bold">
              HISTORIAL DE RECIBOS
            </h4>
            <button
              onClick={() => receipts[0] && setSelectedReceipt(receipts[0])}
              className="font-condensed text-[13px] uppercase text-[#c4c9ac] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>VER TODOS</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>

          <div className="bg-[#1e2024] rounded-xl divide-y divide-[#444933]/20 border border-[#444933]/20 overflow-hidden">
            {receipts.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedReceipt(rec)}
                className="p-3 flex items-center justify-between hover:bg-[#282a2e] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#282a2e] flex items-center justify-center text-[#c3f400] border border-[#444933]/30">
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  </div>
                  <div>
                    <span className="font-inter text-sm font-semibold text-white block leading-tight">
                      {rec.title}
                    </span>
                    <span className="font-condensed text-[12px] uppercase text-[#c4c9ac]">
                      {rec.date} • {rec.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-condensed text-[20px] font-bold text-white">
                    {rec.amount.toFixed(2).replace('.', ',')} €
                  </span>
                  <button
                    aria-label={`Descargar PDF ${rec.date}`}
                    className="p-1.5 rounded text-[#c4c9ac] hover:text-[#c3f400] hover:bg-[#1a1c20] transition-colors active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Security Footnote */}
        <section className="py-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#c4c9ac] font-condensed text-[12px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] text-[#8e9379]">lock</span>
            <span>PAGOS ENCRIPTADOS Y SEGUROS MEDIANTE PROTOCOLO SSL</span>
          </div>
        </section>
      </main>

      {/* Plan Change Modal */}
      {selectedPlanForChange && (
        <PlanChangeModal
          isOpen={!!selectedPlanForChange}
          onClose={() => setSelectedPlanForChange(null)}
          plan={selectedPlanForChange}
          billingCycle={billingCycle}
        />
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <PaymentMethodModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={selectedReceipt}
        />
      )}
    </div>
  );
};
