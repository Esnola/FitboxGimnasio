import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { GymClass } from '../types';
import { QrPassModal } from '../components/modals/QrPassModal';
import confetti from 'canvas-confetti';

interface ClassesScreenProps {
  onOpenAuth: () => void;
}

export const ClassesScreen: React.FC<ClassesScreenProps> = ({ onOpenAuth }) => {
  const {
    currentMember,
    classes,
    bookings,
    selectedDate,
    setSelectedDate,
    selectedCategory,
    setSelectedCategory,
    reserveClass,
    cancelReservation,
    joinWaitlist,
    leaveWaitlist,
  } = useGym();

  const [selectedLocation, setSelectedLocation] = useState('FitBox Central');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showFullMonthModal, setShowFullMonthModal] = useState(false);
  const [activeQrBooking, setActiveQrBooking] = useState<{
    classTitle: string;
    classTime: string;
    location?: string;
    coach?: string;
    boxPassCode?: string;
  } | null>(null);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const weekDays = [
    { num: '24', day: 'LUN', date: '2024-10-24', hasBooking: false, dotColor: 'bg-[#8e9379]' },
    { num: '25', day: 'MAR', date: '2024-10-25', hasBooking: true, dotColor: 'bg-[#0c0e12]' },
    { num: '26', day: 'MIÉ', date: '2024-10-26', hasBooking: false, dotColor: 'bg-[#c3f400]' },
    { num: '27', day: 'JUE', date: '2024-10-27', hasBooking: false, dotColor: 'bg-[#c3f400]' },
    { num: '28', day: 'VIE', date: '2024-10-28', hasBooking: false, dotColor: 'bg-[#fb5b1b]' },
    { num: '29', day: 'SÁB', date: '2024-10-29', hasBooking: false, dotColor: 'bg-[#c3f400]' },
    { num: '30', day: 'DOM', date: '2024-10-30', hasBooking: false, dotColor: 'bg-[#8e9379]' },
  ];

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'crossfit', label: 'CrossFit' },
    { id: 'halterofilia', label: 'Halterofilia' },
    { id: 'endurance', label: 'Endurance / Funcional' },
    { id: 'openbox', label: 'Open Box' },
    { id: 'mobility', label: 'Mobility & Core' },
  ];

  // Filter classes by date and category
  const filteredClasses = classes.filter((c) => {
    const matchesDate = c.date === selectedDate;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesDate && matchesCategory;
  });

  const handleReserve = async (gymClass: GymClass) => {
    const res = await reserveClass(gymClass);
    if (res.success) {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#c3f400', '#ffffff'],
      });
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  const handleCancel = async (classId: string) => {
    if (window.confirm('¿Confirmas que deseas cancelar tu reserva para esta clase?')) {
      const res = await cancelReservation(classId);
      showToast(res.message);
    }
  };

  const handleWaitlist = async (gymClass: GymClass, isInWaitlist: boolean) => {
    if (isInWaitlist) {
      const res = await leaveWaitlist(gymClass.id);
      showToast(res.message);
    } else {
      const res = await joinWaitlist(gymClass);
      showToast(res.message);
    }
  };

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
      <header className="sticky top-0 z-40 bg-[#111317]/90 backdrop-blur-md px-4 py-2 flex items-center justify-between transition-colors border-b border-white/5">
        <div className="flex items-center space-x-3">
          {/* Leading Avatar / Brand icon */}
          <button
            onClick={onOpenAuth}
            title="Cambiar usuario o perfil"
            className="relative w-9 h-9 rounded-full overflow-hidden border border-[#444933]/40 bg-[#1e2024] flex items-center justify-center cursor-pointer hover:border-[#c3f400] transition-colors"
          >
            <img
              className="w-full h-full object-cover"
              alt="Avatar Atleta"
              src={currentMember.avatarUrl}
            />
          </button>
          <div className="flex flex-col">
            <div
              className="flex items-center space-x-1.5 cursor-pointer relative"
              onClick={() => setShowLocationMenu(!showLocationMenu)}
            >
              <span className="font-condensed text-[13px] text-[#c3f400] tracking-wider uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {selectedLocation}
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </span>

              {/* Location Dropdown */}
              {showLocationMenu && (
                <div className="absolute top-6 left-0 bg-[#1e2024] border border-[#444933] rounded-lg shadow-2xl py-1 w-44 z-50 animate-fadeIn">
                  {['FitBox Central', 'FitBox Arena Norte', 'FitBox Studio Sur'].map((loc) => (
                    <button
                      key={loc}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLocation(loc);
                        setShowLocationMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-condensed uppercase tracking-wider hover:bg-[#333539] ${
                        selectedLocation === loc ? 'text-[#c3f400] font-bold' : 'text-[#e2e2e8]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <h1 className="font-condensed text-[28px] font-bold text-white uppercase tracking-tight leading-none">
              RESERVAR CLASES
            </h1>
          </div>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSelectedCategory('all')}
            title="Restablecer filtros"
            aria-label="Filtrar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#c4c9ac] hover:text-white hover:bg-[#333539] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">tune</span>
          </button>
          <button
            onClick={onOpenAuth}
            aria-label="Notificaciones"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#c4c9ac] hover:text-white hover:bg-[#333539] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#fb5b1b]"></span>
          </button>
        </div>
      </header>

      {/* HORIZONTAL WEEK SELECTOR */}
      <section className="px-4 pt-2 pb-2">
        <div className="flex items-center justify-between pb-2">
          <span className="font-condensed text-[13px] text-[#c4c9ac] uppercase tracking-wider font-semibold">
            OCTUBRE 2024 · SEMANA 43
          </span>
          <button
            onClick={() => setShowFullMonthModal(true)}
            className="font-condensed text-[13px] text-[#c3f400] uppercase flex items-center tracking-wider hover:underline"
          >
            Mes completo{' '}
            <span className="material-symbols-outlined text-[14px] ml-0.5">calendar_month</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {weekDays.map((d) => {
            const isSelected = selectedDate === d.date;
            return (
              <button
                key={d.num}
                onClick={() => setSelectedDate(d.date)}
                className={`flex-shrink-0 w-12 py-2 rounded-lg border flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#c3f400] text-[#0c0e12] border-[#c3f400] shadow-lg shadow-[#c3f400]/20 font-bold'
                    : 'bg-[#1a1c20] text-[#e2e2e8] border-white/5 hover:bg-[#1e2024]'
                }`}
              >
                <span
                  className={`font-condensed text-[12px] uppercase ${
                    isSelected ? 'font-bold tracking-wide' : 'text-[#c4c9ac]'
                  }`}
                >
                  {d.day}
                </span>
                <span className="font-condensed text-[24px] font-extrabold leading-tight">
                  {d.num}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected ? 'bg-[#0c0e12]' : d.dotColor
                  }`}
                ></span>
              </button>
            );
          })}
        </div>
      </section>

      {/* DISCIPLINE FILTER CHIPS */}
      <section className="px-4 py-1">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? classes.filter((c) => c.date === selectedDate).length
                : classes.filter((c) => c.date === selectedDate && c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-condensed text-[13px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0c0e12] font-bold shadow-sm'
                    : 'bg-[#1e2024] border border-white/10 text-[#e2e2e8] hover:border-[#c3f400]'
                }`}
              >
                {cat.label} {cat.id === 'all' && `(${count})`}
              </button>
            );
          })}
        </div>
      </section>

      {/* POLICY NOTICE BANNER */}
      <div className="px-4 pt-1">
        <div className="bg-[#282a2e]/80 border border-[#444933]/30 rounded-lg p-2.5 flex items-start space-x-2.5 backdrop-blur-sm">
          <span className="material-symbols-outlined text-[#c3f400] text-[20px] flex-shrink-0 mt-0.5">
            info
          </span>
          <p className="font-inter text-xs text-[#c4c9ac] leading-tight">
            <strong className="text-white font-semibold">Política de cancelación:</strong> Cancela hasta
            1 hora antes sin penalización de créditos de tu cuota mensual.
          </p>
        </div>
      </div>

      {/* SESSIONS TIMELINE LIST */}
      <main className="px-4 py-3 space-y-3.5">
        {filteredClasses.length === 0 ? (
          <div className="bg-[#1a1c20] border border-white/5 rounded-xl p-8 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#c4c9ac]">event_busy</span>
            <p className="text-sm font-inter text-[#c4c9ac]">
              No hay clases programadas para esta categoría en este día.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-1.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold uppercase text-xs mt-2"
            >
              Ver todas las clases del día
            </button>
          </div>
        ) : (
          filteredClasses.map((item) => {
            const confirmedBooking = bookings.find(
              (b) => b.classId === item.id && b.status === 'confirmed'
            );
            const waitlistBooking = bookings.find(
              (b) => b.classId === item.id && b.status === 'waitlist'
            );
            const isBooked = !!confirmedBooking;
            const isInWaitlist = !!waitlistBooking;
            const isFull = item.bookedCount >= item.maxCapacity;
            const remainingSpots = item.maxCapacity - item.bookedCount;

            // Render Card with border highlight if booked
            return (
              <article
                key={item.id}
                className={`rounded-xl p-4 transition-all duration-200 relative overflow-hidden ${
                  isBooked
                    ? 'bg-[#1e2024] border-2 border-[#c3f400]/70 shadow-lg shadow-[#c3f400]/5'
                    : 'bg-[#1a1c20] border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute -right-10 -top-10 w-28 h-28 bg-[#c3f400]/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-condensed text-[24px] text-white font-bold">
                        {item.startTime} - {item.endTime}
                      </span>
                      <span
                        className={`font-condensed text-[13px] uppercase px-2 py-0.5 rounded font-semibold ${
                          isBooked
                            ? 'bg-[#c3f400]/20 text-[#c3f400]'
                            : 'bg-[#333539] text-[#c4c9ac]'
                        }`}
                      >
                        {item.location}
                      </span>
                    </div>
                    <h2 className="font-condensed text-[26px] text-white uppercase font-bold tracking-tight">
                      {item.title}
                    </h2>
                  </div>

                  {/* Status Badge */}
                  {isBooked ? (
                    <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[#c3f400] text-[#0c0e12] font-bold">
                      <span className="material-symbols-outlined text-[16px] font-bold">
                        check_circle
                      </span>
                      <span className="font-condensed text-[13px] uppercase tracking-wider">
                        YA RESERVADO
                      </span>
                    </div>
                  ) : isFull ? (
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#93000a]/20 border border-[#93000a]/40 text-[#ffb4ab]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fb5b1b] animate-pulse"></span>
                      <span className="font-condensed text-[13px] uppercase font-bold tracking-wider">
                        {item.maxCapacity}/{item.maxCapacity} · AGOTADO
                      </span>
                    </div>
                  ) : remainingSpots <= 4 ? (
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#fb5b1b]/10 border border-[#fb5b1b]/40 text-[#ffb59d]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fb5b1b] animate-ping"></span>
                      <span className="font-condensed text-[13px] uppercase font-bold tracking-wider">
                        ¡{remainingSpots}/{item.maxCapacity} Plazas!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#0c0e12] border border-[#c3f400]/30 text-[#c3f400]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
                      <span className="font-condensed text-[13px] uppercase font-bold tracking-wider">
                        {remainingSpots}/{item.maxCapacity} Plazas libres
                      </span>
                    </div>
                  )}
                </div>

                {/* Coach & Subtitle Meta */}
                <div className="mt-3 flex items-center justify-between text-xs text-[#c4c9ac] border-t border-white/5 pt-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isBooked ? 'bg-[#c3f400] text-[#0c0e12]' : 'bg-[#333539] text-white'
                      }`}
                    >
                      {item.coachInitials}
                    </div>
                    <span className="font-inter text-white">{item.coachName}</span>
                  </div>
                  <span className="font-condensed text-[13px] text-[#c4c9ac] uppercase font-semibold">
                    {item.sublabel || item.intensity}
                  </span>
                </div>

                {/* If booked: show Token Pass */}
                {isBooked && (
                  <div className="mt-2.5 flex items-center justify-between bg-[#0c0e12] px-3 py-1 rounded border border-[#c3f400]/30 text-xs">
                    <span className="font-condensed text-[12px] uppercase text-[#c4c9ac]">
                      Pase de acceso garantizado
                    </span>
                    <span className="font-condensed text-[13px] text-[#c3f400] font-bold uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
                      BOX-PASS: {confirmedBooking.boxPassCode}
                    </span>
                  </div>
                )}

                {/* CTAs */}
                {isBooked ? (
                  <div className="mt-3 pt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCancel(item.id)}
                      className="py-2.5 rounded-lg border border-[#ffb4ab]/50 text-[#ffb4ab] hover:bg-[#93000a]/20 font-condensed font-bold text-[16px] uppercase tracking-wider flex items-center justify-center space-x-1 transition-all active:scale-98 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                      <span>Cancelar reserva</span>
                    </button>
                    <button
                      onClick={() =>
                        setActiveQrBooking({
                          classTitle: item.title,
                          classTime: `${item.startTime} - ${item.endTime}`,
                          location: item.location,
                          coach: item.coachName,
                          boxPassCode: confirmedBooking.boxPassCode,
                        })
                      }
                      className="py-2.5 rounded-lg bg-[#333539] text-white hover:bg-[#37393e] font-condensed font-bold text-[16px] uppercase tracking-wider flex items-center justify-center space-x-1 transition-all active:scale-98 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                      <span>Ver Pase QR</span>
                    </button>
                  </div>
                ) : isFull ? (
                  <button
                    onClick={() => handleWaitlist(item, isInWaitlist)}
                    className={`mt-3 w-full py-2.5 rounded-lg border-2 font-condensed text-[16px] uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all duration-150 active:scale-98 cursor-pointer ${
                      isInWaitlist
                        ? 'border-[#c3f400] text-[#c3f400] bg-[#c3f400]/10 font-bold'
                        : 'border-[#fb5b1b]/80 text-[#fb5b1b] hover:bg-[#fb5b1b]/10 font-bold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                    <span>
                      {isInWaitlist
                        ? `Estás en la lista (#${waitlistBooking.boxPassCode}) - Salir`
                        : `Unirse a lista de espera (${item.waitlistCount} en espera)`}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleReserve(item)}
                    className="mt-3 w-full py-2.5 rounded-lg bg-[#c3f400] text-[#0c0e12] font-condensed text-[16px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md shadow-[#c3f400]/10 transition-all duration-150 hover:brightness-110 active:scale-98 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                    <span>Reservar Plaza</span>
                  </button>
                )}
              </article>
            );
          })
        )}
      </main>

      {/* QR Pass Modal */}
      {activeQrBooking && (
        <QrPassModal
          isOpen={!!activeQrBooking}
          onClose={() => setActiveQrBooking(null)}
          bookingInfo={activeQrBooking}
        />
      )}

      {/* Full Month Modal */}
      {showFullMonthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1e2024] border border-[#c3f400]/40 rounded-2xl w-full max-w-sm p-5 text-center relative">
            <button
              onClick={() => setShowFullMonthModal(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#333539] text-white flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h3 className="font-condensed text-xl font-bold uppercase text-white mb-2">
              Calendario Octubre 2024
            </h3>
            <p className="text-xs text-[#c4c9ac] mb-4">
              Selecciona un día para ver su programación de WODs y entrenamientos:
            </p>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                <span key={i} className="text-xs font-condensed text-[#c4c9ac] uppercase font-bold">
                  {d}
                </span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const dayStr = d < 10 ? `0${d}` : `${d}`;
                const dateKey = `2024-10-${dayStr}`;
                const isSelected = selectedDate === dateKey;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      setShowFullMonthModal(false);
                    }}
                    className={`aspect-square rounded flex items-center justify-center font-condensed text-sm cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#c3f400] text-[#111317] font-extrabold ring-2 ring-[#c3f400]'
                        : d >= 24 && d <= 30
                        ? 'bg-[#282a2e] text-white hover:bg-[#333539]'
                        : 'bg-[#1a1c20] text-[#8e9379]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
