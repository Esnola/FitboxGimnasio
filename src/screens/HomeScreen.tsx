import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { QrPassModal } from '../components/modals/QrPassModal';
import { ScoreModal } from '../components/modals/ScoreModal';
import confetti from 'canvas-confetti';

interface HomeScreenProps {
  onOpenAuth: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenAuth }) => {
  const {
    currentMember,
    bookings,
    classes,
    setActiveTab,
    cancelReservation,
    reserveClass,
    setSelectedDate,
  } = useGym();

  const [showQrModal, setShowQrModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [todayFilter, setTodayFilter] = useState<'all' | 'crossfit' | 'openbox' | 'mobility'>('all');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Find upcoming confirmed booking
  const upcomingBooking = bookings.find((b) => b.status === 'confirmed');

  // Related class for upcoming booking if available
  const upcomingClass = upcomingBooking
    ? classes.find((c) => c.id === upcomingBooking.classId)
    : null;

  const handleCancelUpcoming = async () => {
    if (!upcomingBooking) return;
    if (window.confirm('¿Deseas cancelar tu próxima reserva?')) {
      const res = await cancelReservation(upcomingBooking.classId);
      showToast(res.message);
    }
  };

  const handleQuickReserve = async (classId: string) => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return;
    const res = await reserveClass(targetClass);
    if (res.success) {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#c3f400', '#ffffff'],
      });
    }
    showToast(res.message);
  };

  // Classes for today (2024-10-25)
  const todayClasses = classes.filter((c) => {
    const isToday = c.date === '2024-10-25';
    if (!isToday) return false;
    if (todayFilter === 'all') return true;
    if (todayFilter === 'crossfit') return c.category === 'crossfit';
    if (todayFilter === 'openbox') return c.category === 'openbox';
    if (todayFilter === 'mobility') return c.category === 'mobility';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#111317] text-[#e2e2e8] pb-28 relative">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1e2024] border border-[#c3f400] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-xs text-xs font-inter animate-bounce">
          <span className="material-symbols-outlined text-[#c3f400] text-[18px]">info</span>
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-[#111317]/95 backdrop-blur-md border-b border-[#444933]/30 px-4 py-2 flex justify-between items-center w-full transition-colors">
        <div className="flex items-center gap-3">
          {/* Leading Avatar with Level Badge */}
          <div className="relative">
            <button
              onClick={onOpenAuth}
              className="w-11 h-11 rounded-xl overflow-hidden border border-[#444933]/50 bg-[#282a2e] p-0.5 cursor-pointer block hover:border-[#c3f400] transition-colors"
            >
              <img
                alt="Foto de perfil del socio atleta"
                className="w-full h-full object-cover rounded-lg"
                src={currentMember.avatarUrl}
              />
            </button>
            <span className="absolute -bottom-1 -right-1 bg-[#c3f400] text-[#111317] font-condensed text-[12px] px-1 py-0.2 rounded font-extrabold tracking-wider">
              {currentMember.level}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#c4c9ac] font-condensed text-[13px] tracking-wider uppercase">
              HOLA, ATLETA
            </span>
            <h1 className="text-white font-condensed text-[28px] font-bold leading-none uppercase">
              ¡HOLA, {currentMember.name.split(' ')[0]}! 💪
            </h1>
          </div>
        </div>

        {/* Trailing Notification Button */}
        <button
          onClick={onOpenAuth}
          aria-label="Notificaciones"
          className="relative p-2 rounded-xl bg-[#1e2024] text-[#e2e2e8] hover:bg-[#333539] transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-white text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-4 pt-3 space-y-3.5 flex-1">
        {/* Plan Status Express Banner */}
        <section
          onClick={() => setActiveTab('cuota')}
          className="rounded-xl p-2.5 bg-[#1a1c20] border border-[#444933]/30 flex items-center justify-between cursor-pointer hover:border-[#c3f400]/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1e2024] flex items-center justify-center text-[#c3f400]">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                credit_card
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-condensed text-[15px] font-bold text-white uppercase">
                  {currentMember.planName.toUpperCase()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] inline-block"></span>
              </div>
              <p className="font-inter text-xs text-[#c4c9ac]">
                Renueva en 12 días • Cuota al día
              </p>
            </div>
          </div>
          <span className="bg-[#c3f400]/10 border border-[#c3f400]/40 text-[#c3f400] font-condensed text-[12px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
            ACTIVO
          </span>
        </section>

        {/* Featured Upcoming Reservation Card */}
        {upcomingBooking ? (
          <section className="rounded-xl bg-[#1e2024] border border-[#444933]/40 p-4 relative overflow-hidden shadow-lg">
            <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-[#c3f400]/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[#c3f400] bg-[#c3f400]/15 px-2 py-0.5 rounded font-condensed text-[13px] font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-ping"></span>
                TU PRÓXIMA RESERVA
              </span>
              <span className="font-condensed text-[13px] text-[#c4c9ac] uppercase">
                Hoy • {upcomingBooking.classTime.split(' - ')[0]}
              </span>
            </div>

            <div className="mb-3">
              <h2 className="font-condensed text-[38px] font-extrabold text-white tracking-tight leading-none mb-1 uppercase">
                {upcomingBooking.classTitle}
              </h2>
              <div className="flex items-center gap-4 text-[#c4c9ac] font-inter text-xs">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#c3f400]">
                    sports_gymnastics
                  </span>
                  <span>{upcomingClass?.coachName || 'Coach Marcos R.'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#8e9379]">
                    location_on
                  </span>
                  <span>{upcomingClass?.location || 'Box Principal'}</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              <button
                onClick={() => setShowQrModal(true)}
                className="col-span-4 bg-[#c3f400] text-[#111317] py-2.5 px-3 rounded-lg font-condensed text-[15px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                <span>Check-in QR / Detalles</span>
              </button>
              <button
                onClick={handleCancelUpcoming}
                className="col-span-1 bg-[#333539]/60 hover:bg-[#333539] border border-[#fb5b1b]/40 text-[#ffb59d] py-2.5 rounded-lg flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                title="Cancelar reserva"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-xl bg-[#1e2024] border border-[#444933]/40 p-4 text-center space-y-2">
            <span className="font-condensed text-[13px] text-[#c4c9ac] uppercase block font-semibold">
              SIN RESERVAS ACTIVAS HOY
            </span>
            <p className="text-xs text-[#e2e2e8] font-inter">
              Explora las clases disponibles y asegura tu plaza en el box.
            </p>
            <button
              onClick={() => setActiveTab('clases')}
              className="py-2 px-4 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-xs uppercase"
            >
              Ver Horarios de Clases
            </button>
          </section>
        )}

        {/* WOD de Hoy (Workout of the Day) Bento Unit */}
        <section className="rounded-xl bg-[#1a1c20] border border-[#444933]/40 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400]">timer</span>
              <span className="font-condensed text-[14px] text-white tracking-wider uppercase font-bold">
                WOD DEL DÍA
              </span>
            </div>
            <span className="text-[#ffdbd0] font-condensed text-[12px] font-bold px-2 py-0.5 rounded bg-[#fb5b1b]/20 border border-[#fb5b1b]/30 uppercase">
              Cap: 24 MIN
            </span>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-condensed text-[28px] font-extrabold text-white tracking-wide">
                "MURPH PREP"
              </h3>
              <p className="font-inter text-xs text-[#c4c9ac]">For Time • 5 Rondas intensivas</p>
            </div>
            <div className="text-right">
              <span className="font-condensed text-[12px] text-[#c4c9ac] block uppercase">
                Dificultad
              </span>
              <span className="font-condensed text-[15px] text-[#c3f400] font-bold">
                AVANZADO / RX
              </span>
            </div>
          </div>

          {/* Key Movements Pills Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#1e2024] p-2 rounded-lg border border-white/5 text-center">
              <span className="font-condensed text-[28px] font-extrabold text-white block leading-none">
                15
              </span>
              <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">
                Pull-ups
              </span>
            </div>
            <div className="bg-[#1e2024] p-2 rounded-lg border border-white/5 text-center">
              <span className="font-condensed text-[28px] font-extrabold text-white block leading-none">
                20
              </span>
              <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">
                Box Jumps
              </span>
            </div>
            <div className="bg-[#1e2024] p-2 rounded-lg border border-white/5 text-center">
              <span className="font-condensed text-[28px] font-extrabold text-white block leading-none">
                15
              </span>
              <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">
                Thrusters 45kg
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowScoreModal(true)}
            className="w-full bg-[#333539] hover:bg-[#37393e] text-white border border-[#c3f400]/30 py-2 rounded-lg font-condensed text-[14px] uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[#c3f400] text-base">edit_note</span>
            <span>Registrar Marca / Score</span>
          </button>
        </section>

        {/* Weekly Activity & Streak Bento Grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Attendance & Streak */}
          <div className="bg-[#1a1c20] border border-[#444933]/30 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase font-semibold">
                Asistencia
              </span>
              <span className="flex items-center text-[#fb5b1b] font-condensed text-[12px] font-bold">
                <span
                  className="material-symbols-outlined text-sm mr-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                12 DÍAS
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="font-condensed text-[34px] font-extrabold text-white leading-none">
                4
              </span>
              <span className="font-condensed text-[16px] text-[#c4c9ac]">/ 5 DÍAS</span>
            </div>
            {/* Bar Graph Minimalist */}
            <div className="flex items-end justify-between gap-1 h-10 pt-2 border-t border-white/5">
              <div className="w-3 bg-[#c3f400] h-8 rounded-xs" title="Lunes"></div>
              <div className="w-3 bg-[#c3f400] h-10 rounded-xs" title="Martes"></div>
              <div className="w-3 bg-[#c3f400] h-6 rounded-xs" title="Miércoles"></div>
              <div className="w-3 bg-[#c3f400] h-9 rounded-xs" title="Jueves"></div>
              <div className="w-3 bg-[#333539] h-3 rounded-xs" title="Viernes"></div>
              <div className="w-3 bg-[#333539] h-2 rounded-xs" title="Sábado"></div>
              <div className="w-3 bg-[#333539] h-1 rounded-xs" title="Domingo"></div>
            </div>
          </div>

          {/* Calories & Benchmark Metric */}
          <div className="bg-[#1a1c20] border border-[#444933]/30 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase font-semibold">
                Calorías Est.
              </span>
              <span className="material-symbols-outlined text-[#c3f400] text-base">bolt</span>
            </div>
            <div>
              <span className="font-condensed text-[34px] font-extrabold text-white block leading-none">
                3.180
              </span>
              <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">
                KCAL QUEMADAS
              </span>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-inter text-[#c4c9ac]">
              <span>Ritmo semanal</span>
              <span className="text-[#c3f400] font-condensed font-bold">+14% vs anterior</span>
            </div>
          </div>
        </section>

        {/* Class Schedule Today Section */}
        <section className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-condensed text-[22px] font-bold text-white uppercase">
              CLASES DE HOY
            </h3>
            <button
              onClick={() => {
                setSelectedDate('2024-10-25');
                setActiveTab('clases');
              }}
              className="font-condensed text-[13px] text-[#c3f400] uppercase cursor-pointer hover:underline font-bold"
            >
              Ver semana
            </button>
          </div>

          {/* Schedule Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {[
              { id: 'all' as const, label: 'Todas' },
              { id: 'crossfit' as const, label: 'CrossFit' },
              { id: 'openbox' as const, label: 'Open Box' },
              { id: 'mobility' as const, label: 'Mobility' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTodayFilter(f.id)}
                className={`px-3 py-1 rounded font-condensed text-[13px] uppercase whitespace-nowrap cursor-pointer transition-all ${
                  todayFilter === f.id
                    ? 'bg-[#c3f400] text-[#111317] font-bold'
                    : 'bg-[#1e2024] text-[#c4c9ac] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Schedule Items */}
          <div className="space-y-2">
            {todayClasses.slice(0, 4).map((c) => {
              const isUserBooked = bookings.some(
                (b) => b.classId === c.id && b.status === 'confirmed'
              );
              const isFull = c.bookedCount >= c.maxCapacity;
              const remaining = c.maxCapacity - c.bookedCount;

              return (
                <div
                  key={c.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isUserBooked
                      ? 'bg-[#282a2e] border-[#c3f400]/60 shadow-sm'
                      : isFull
                      ? 'bg-[#1e2024] border-white/5 opacity-70'
                      : 'bg-[#1e2024] border-[#444933]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-condensed text-[16px] w-12 font-bold ${
                        isUserBooked ? 'text-[#c3f400]' : 'text-white'
                      }`}
                    >
                      {c.startTime}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-condensed text-[15px] font-bold text-white uppercase leading-tight">
                          {c.title}
                        </p>
                        {isUserBooked && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#c4c9ac] font-inter">
                        {c.coachName} • {c.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isUserBooked ? (
                      <span className="bg-[#c3f400] text-[#111317] font-condensed text-[12px] px-2 py-0.5 rounded uppercase font-extrabold">
                        TU RESERVA
                      </span>
                    ) : isFull ? (
                      <span className="bg-[#333539] text-[#c4c9ac] font-condensed text-[12px] px-2 py-0.5 rounded uppercase font-bold">
                        COMPLETO
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[#fb5b1b] font-condensed text-[12px] uppercase bg-[#fb5b1b]/10 px-2 py-0.5 rounded border border-[#fb5b1b]/20 font-bold">
                          {remaining} PLAZAS
                        </span>
                        <button
                          onClick={() => handleQuickReserve(c.id)}
                          className="bg-[#333539] hover:bg-[#c3f400] hover:text-[#111317] text-white px-2.5 py-1 rounded font-condensed text-[12px] uppercase transition-colors font-bold cursor-pointer"
                        >
                          RESERVAR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* QR Modal */}
      {showQrModal && (
        <QrPassModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          bookingInfo={
            upcomingBooking
              ? {
                  classTitle: upcomingBooking.classTitle,
                  classTime: upcomingBooking.classTime,
                  location: upcomingClass?.location || 'Box Principal',
                  coach: upcomingClass?.coachName || 'Coach Marcos R.',
                  boxPassCode: upcomingBooking.boxPassCode,
                }
              : undefined
          }
        />
      )}

      {/* Score Modal */}
      {showScoreModal && (
        <ScoreModal isOpen={showScoreModal} onClose={() => setShowScoreModal(false)} />
      )}
    </div>
  );
};
