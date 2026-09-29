import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { QrPassModal } from '../components/modals/QrPassModal';
import { EditProfileModal } from '../components/modals/EditProfileModal';

interface ProfileScreenProps {
  onOpenAuth: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenAuth }) => {
  const {
    currentMember,
    updateMemberProfile,
    signOutUser,
    authUser,
    bookings,
    classes,
    cancelReservation,
    setActiveTab,
  } = useGym();
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [bookingTab, setBookingTab] = useState<'futuras' | 'pasadas'>('futuras');
  const [selectedBookingForQr, setSelectedBookingForQr] = useState<{
    classTitle: string;
    classTime: string;
    location?: string;
    coach?: string;
    boxPassCode?: string;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCancelBooking = async (classId: string) => {
    if (window.confirm('¿Confirmas que deseas cancelar esta reserva?')) {
      const res = await cancelReservation(classId);
      showToast(res.message);
    }
  };

  // Date threshold for future vs past (using Oct 25, 2024 as in the mockups)
  const todayDateStr = '2024-10-25';
  const futureBookings = bookings
    .filter(
      (b) => b.classDate >= todayDateStr && (b.status === 'confirmed' || b.status === 'waitlist')
    )
    .sort((a, b) => a.classDate.localeCompare(b.classDate));

  const pastBookings = bookings
    .filter((b) => b.classDate < todayDateStr && b.status !== 'cancelled')
    .sort((a, b) => b.classDate.localeCompare(a.classDate));

  // Toggles
  const [classReminders, setClassReminders] = useState(currentMember.classReminders);
  const [healthSync, setHealthSync] = useState(currentMember.healthSync);

  const toggleReminders = async () => {
    const newVal = !classReminders;
    setClassReminders(newVal);
    await updateMemberProfile({ classReminders: newVal });
  };

  const toggleHealth = async () => {
    const newVal = !healthSync;
    setHealthSync(newVal);
    await updateMemberProfile({ healthSync: newVal });
  };

  const handleSignOutClick = async () => {
    if (authUser) {
      if (window.confirm('¿Deseas cerrar la sesión activa?')) {
        await signOutUser();
      }
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className="min-h-screen bg-[#111317] text-[#e2e2e8] pb-28 relative">
      {/* TopAppBar */}
      <header className="bg-[#111317] border-b border-[#444933]/30 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-4 py-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full border border-[#c3f400] flex items-center justify-center bg-[#1e2024] overflow-hidden">
              <span className="material-symbols-outlined text-[#c3f400] text-lg">person</span>
            </div>
            <h1 className="text-[26px] font-condensed uppercase tracking-wider text-white font-bold leading-none">
              HOLA, ATLETA
            </h1>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#c4c9ac] hover:bg-[#333539] transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-3 space-y-4">
        {/* Header Perfil de Socio */}
        <section className="bg-[#1e2024] border border-[#444933]/20 rounded-xl p-4 relative overflow-hidden shadow-lg">
          <div className="absolute -right-10 -top-10 w-36 h-36 bg-[#c3f400]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-3.5">
              {/* Foto con marco neón */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#c3f400] to-[#333539] neon-glow">
                  <img
                    className="w-full h-full object-cover rounded-full bg-[#282a2e]"
                    alt="Foto Atleta"
                    src={currentMember.avatarUrl}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#0c0e12] border border-[#c3f400] rounded-full px-1.5 py-0.5 flex items-center justify-center">
                  <span className="font-condensed text-[12px] font-extrabold text-[#c3f400]">
                    {currentMember.level}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h2 className="font-condensed text-[24px] uppercase text-white tracking-wide font-bold">
                    {currentMember.name}
                  </h2>
                  <span
                    className="material-symbols-outlined text-[#c3f400] text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <p className="font-condensed text-[13px] text-[#c3f400] font-bold uppercase">
                  Atleta Senior - Nivel {currentMember.level}
                </p>
                <p className="font-inter text-xs text-[#c4c9ac] font-mono mt-0.5">
                  ID {currentMember.memberId}
                </p>
              </div>
            </div>

            {/* Botón Edición */}
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg bg-[#282a2e] text-[#c4c9ac] hover:text-white hover:bg-[#333539] transition-colors active:scale-95 cursor-pointer"
              title="Editar datos de atleta"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>

          {/* Membresía Badge & Estado */}
          <div className="mt-3.5 pt-3 border-t border-[#444933]/20 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-[#0c0e12] px-2.5 py-1 rounded-full border border-[#444933]/30">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
              <span className="font-condensed text-[12px] uppercase tracking-wider text-white font-bold">
                {currentMember.planName.toUpperCase()}
              </span>
            </div>
            <span className="font-condensed text-[12px] uppercase text-[#c4c9ac]">
              Vigente hasta 31/12/2025
            </span>
          </div>
        </section>

        {/* Carnet Digital con Código QR Dinámico */}
        <section
          onClick={() => setShowQrModal(true)}
          className="bg-gradient-to-b from-[#1e2024] to-[#1a1c20] border border-[#c3f400]/30 rounded-xl p-4 relative overflow-hidden neon-glow cursor-pointer transition-transform active:scale-99"
        >
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#c3f400]">qr_code_scanner</span>
              <h3 className="font-condensed text-[16px] uppercase tracking-wider text-white font-bold">
                Carnet de Acceso Digital
              </h3>
            </div>
            <span className="font-condensed text-[12px] uppercase px-2 py-0.5 rounded bg-[#c3f400] text-[#0c0e12] font-extrabold">
              TORNO ACTIVO
            </span>
          </div>

          <div className="flex flex-row items-center justify-between gap-3 bg-[#0c0e12] p-3 rounded-lg border border-[#444933]/30">
            {/* Visual QR Mockup */}
            <div className="relative p-2 bg-white rounded-lg flex items-center justify-center shadow-inner shrink-0">
              <div className="w-20 h-20 grid grid-cols-5 gap-1 bg-[#0c0e12] p-1.5 rounded">
                <div className="bg-white col-span-2 row-span-2 rounded-xs border border-[#0c0e12]"></div>
                <div className="bg-white col-span-1"></div>
                <div className="bg-white col-span-2 row-span-2 rounded-xs border border-[#0c0e12]"></div>
                <div className="bg-white col-span-1"></div>
                <div className="bg-[#c3f400] col-span-1 rounded-xs"></div>
                <div className="bg-white col-span-1"></div>
                <div className="bg-white col-span-1"></div>
                <div className="bg-[#c3f400] col-span-1"></div>
                <div className="bg-white col-span-2 row-span-2 rounded-xs border border-[#0c0e12]"></div>
                <div className="bg-[#c3f400] col-span-1"></div>
                <div className="bg-white col-span-2"></div>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-left">
              <div className="flex items-center space-x-1.5 text-[#c3f400]">
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span className="font-condensed text-[13px] font-bold uppercase tracking-wider">
                  Código dinámico (30s)
                </span>
              </div>
              <p className="font-inter text-xs text-[#c4c9ac]">
                Acerca la pantalla al lector óptico para registro automático de sesión.
              </p>
              <div className="pt-0.5 flex items-center space-x-1 text-[11px] font-condensed uppercase text-[#c4c9ac]">
                <span className="material-symbols-outlined text-[15px] text-[#c3f400]">pin_drop</span>
                <span>Box Central: Pista 04</span>
              </div>
            </div>
          </div>
        </section>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1e2024] border border-[#c3f400] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-xs text-xs font-inter animate-bounce">
            <span className="material-symbols-outlined text-[#c3f400] text-[18px]">verified</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* SECCIÓN MIS RESERVAS (FUTURAS Y PASADAS) */}
        <section className="bg-[#1e2024] border border-[#444933]/30 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[22px]">
                event_available
              </span>
              <h3 className="font-condensed text-[18px] uppercase tracking-wider text-white font-bold">
                Mis Reservas
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-condensed uppercase px-2 py-0.5 rounded bg-[#0c0e12] border border-[#c3f400]/30 text-[#c3f400] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
              <span>{futureBookings.length} Activas</span>
            </div>
          </div>

          {/* Segmented Filter: Futuras vs Pasadas */}
          <div className="grid grid-cols-2 p-1 rounded-lg bg-[#0c0e12] border border-[#444933]/40 font-condensed text-[13px] uppercase">
            <button
              onClick={() => setBookingTab('futuras')}
              className={`py-1.5 rounded text-center transition-all cursor-pointer font-bold ${
                bookingTab === 'futuras'
                  ? 'bg-[#c3f400] text-[#111317] shadow-sm'
                  : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              Próximas ({futureBookings.length})
            </button>
            <button
              onClick={() => setBookingTab('pasadas')}
              className={`py-1.5 rounded text-center transition-all cursor-pointer font-bold ${
                bookingTab === 'pasadas'
                  ? 'bg-[#c3f400] text-[#111317] shadow-sm'
                  : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              Historial Pasadas ({pastBookings.length})
            </button>
          </div>

          {/* Tab 1: Futuras / Activas */}
          {bookingTab === 'futuras' && (
            <div className="space-y-3 pt-1">
              {futureBookings.length === 0 ? (
                <div className="p-5 rounded-lg bg-[#0c0e12] border border-white/5 text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#c4c9ac]">
                    event_busy
                  </span>
                  <p className="font-inter text-xs text-[#c4c9ac]">
                    No tienes reservas programadas próximamente.
                  </p>
                  <button
                    onClick={() => setActiveTab('clases')}
                    className="mt-1 px-4 py-1.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold uppercase text-xs cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                  >
                    Ver Horarios y Reservar
                  </button>
                </div>
              ) : (
                futureBookings.map((b) => {
                  const gymClass = classes.find((c) => c.id === b.classId);
                  const isWaitlist = b.status === 'waitlist';

                  return (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isWaitlist
                          ? 'bg-[#1a1c20] border-[#fb5b1b]/40'
                          : 'bg-[#1a1c20] border-[#c3f400]/60 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-condensed text-[12px] uppercase text-[#c3f400] font-bold">
                              {b.classDate} • {b.classTime}
                            </span>
                          </div>
                          <h4 className="font-condensed text-[20px] font-extrabold uppercase text-white tracking-wide">
                            {b.classTitle}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`font-condensed text-[11px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${
                            isWaitlist
                              ? 'bg-[#fb5b1b]/20 text-[#fb5b1b] border border-[#fb5b1b]/30'
                              : 'bg-[#c3f400] text-[#111317]'
                          }`}
                        >
                          {isWaitlist ? 'EN ESPERA' : 'CONFIRMADA'}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs text-[#c4c9ac] border-t border-white/5 pt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-[#c3f400]">
                            sports_gymnastics
                          </span>
                          <span>{gymClass?.coachName || 'Coach Asignado'}</span>
                        </div>
                        <div className="flex items-center gap-1 font-condensed text-[#c3f400] font-bold uppercase">
                          <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                          <span>PASS: {b.boxPassCode}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-1 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleCancelBooking(b.classId)}
                          className="py-2 rounded-lg border border-[#ffb4ab]/40 text-[#ffb4ab] hover:bg-[#93000a]/20 font-condensed font-bold text-[14px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                          <span>Cancelar</span>
                        </button>
                        <button
                          onClick={() =>
                            setSelectedBookingForQr({
                              classTitle: b.classTitle,
                              classTime: b.classTime,
                              location: gymClass?.location || 'Box Principal',
                              coach: gymClass?.coachName || 'Coach Asignado',
                              boxPassCode: b.boxPassCode,
                            })
                          }
                          className="py-2 rounded-lg bg-[#333539] text-white hover:bg-[#37393e] font-condensed font-bold text-[14px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                          <span>Ver Pase QR</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: Pasadas / Historial */}
          {bookingTab === 'pasadas' && (
            <div className="space-y-3 pt-1">
              {pastBookings.length === 0 ? (
                <div className="p-5 rounded-lg bg-[#0c0e12] border border-white/5 text-center">
                  <p className="font-inter text-xs text-[#c4c9ac]">
                    Aún no tienes historial de clases pasadas registradas.
                  </p>
                </div>
              ) : (
                pastBookings.map((b) => {
                  const gymClass = classes.find((c) => c.id === b.classId);
                  return (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-[#0c0e12] border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-condensed text-[12px] uppercase text-[#c4c9ac]">
                            {b.classDate} • {b.classTime}
                          </span>
                          <span className="font-condensed text-[10px] uppercase bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">done_all</span>
                            ASISTENCIA REGISTRADA
                          </span>
                        </div>
                        <h4 className="font-condensed text-[17px] font-bold uppercase text-white">
                          {b.classTitle}
                        </h4>
                        <p className="text-[11px] text-[#8e9379] font-inter mt-0.5">
                          {gymClass?.coachName || 'Coach Asignado'} • {gymClass?.location || 'Box Central'}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedBookingForQr({
                            classTitle: b.classTitle,
                            classTime: b.classTime,
                            location: gymClass?.location || 'Box Central',
                            coach: gymClass?.coachName || 'Coach Asignado',
                            boxPassCode: b.boxPassCode,
                          })
                        }
                        className="p-2 rounded-lg bg-[#282a2e] hover:bg-[#333539] text-[#c3f400] transition-colors cursor-pointer"
                        title="Ver detalle del pase"
                      >
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>

        {/* Métricas Clave de Rendimiento */}
        <section>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-condensed text-[16px] uppercase tracking-wider text-white font-bold">
              Rendimiento del Mes
            </h3>
            <span className="font-condensed text-[13px] text-[#c3f400] uppercase font-bold">
              OCTUBRE 2024
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Métrica 1 */}
            <div className="bg-[#1e2024] border border-[#444933]/20 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#c4c9ac]">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">check_circle</span>
                <span className="font-condensed text-[11px] uppercase">Meta: 20</span>
              </div>
              <div className="my-1">
                <div className="font-condensed text-[34px] text-white font-extrabold leading-none">
                  {currentMember.monthlyAttendances}
                </div>
                <p className="font-condensed text-[11px] uppercase text-[#c4c9ac] mt-0.5">
                  Asistencias
                </p>
              </div>
              <div className="w-full bg-[#333539] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#c3f400] h-1.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            {/* Métrica 2 */}
            <div className="bg-[#1e2024] border border-[#fb5b1b]/40 rounded-xl p-2.5 flex flex-col justify-between orange-glow">
              <div className="flex items-center justify-between text-[#c4c9ac]">
                <span
                  className="material-symbols-outlined text-[18px] text-[#fb5b1b]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span className="font-condensed text-[11px] uppercase text-[#fb5b1b] font-bold">
                  ON FIRE
                </span>
              </div>
              <div className="my-1">
                <div className="font-condensed text-[34px] text-white font-extrabold leading-none">
                  {currentMember.streakDays}
                </div>
                <p className="font-condensed text-[11px] uppercase text-[#c4c9ac] mt-0.5">
                  Días Racha
                </p>
              </div>
              <div className="w-full bg-[#333539] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#fb5b1b] h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Métrica 3 */}
            <div className="bg-[#1e2024] border border-[#444933]/20 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#c4c9ac]">
                <span className="material-symbols-outlined text-[18px] text-[#00dbe9]">
                  trending_up
                </span>
                <span className="font-condensed text-[11px] uppercase text-[#00dbe9] font-bold">
                  +4%
                </span>
              </div>
              <div className="my-1">
                <div className="font-condensed text-[34px] text-white font-extrabold leading-none">
                  92<span className="text-[18px] font-bold">%</span>
                </div>
                <p className="font-condensed text-[11px] uppercase text-[#c4c9ac] mt-0.5">
                  Objetivos
                </p>
              </div>
              <div className="w-full bg-[#333539] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#00dbe9] h-1.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa de Calor / Asistencia mensual */}
        <section className="bg-[#1e2024] border border-[#444933]/20 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">
                calendar_month
              </span>
              <h3 className="font-condensed text-[15px] uppercase tracking-wider text-white font-bold">
                Mapa de Esfuerzo & Asistencia
              </h3>
            </div>
            <div className="flex items-center space-x-1 text-[11px] font-condensed text-[#c4c9ac]">
              <span>Suave</span>
              <span className="w-2 h-2 rounded-xs bg-[#333539]"></span>
              <span className="w-2 h-2 rounded-xs bg-[#c3f400]/40"></span>
              <span className="w-2 h-2 rounded-xs bg-[#c3f400]"></span>
              <span>Max RX</span>
            </div>
          </div>

          {/* Días Semanales Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-condensed text-[12px] uppercase text-[#c4c9ac] mb-1 font-bold">
            <span>L</span>
            <span>M</span>
            <span>X</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
            <span>D</span>
          </div>

          {/* Grid de 31 días */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week 1 */}
            <div className="aspect-square bg-[#333539]/30 rounded flex items-center justify-center font-condensed text-[12px] text-[#8e9379]">1</div>
            <div className="aspect-square bg-[#c3f400]/40 rounded flex items-center justify-center font-condensed text-[12px] text-white font-bold">2</div>
            <div className="aspect-square bg-[#c3f400]/80 rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">3</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">4</div>
            <div className="aspect-square bg-[#333539] rounded flex items-center justify-center font-condensed text-[12px] text-[#c4c9ac]">5</div>
            <div className="aspect-square bg-[#c3f400]/90 rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">6</div>
            <div className="aspect-square bg-[#333539]/40 rounded flex items-center justify-center font-condensed text-[12px] text-[#8e9379]">7</div>

            {/* Week 2 */}
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">8</div>
            <div className="aspect-square bg-[#c3f400]/70 rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">9</div>
            <div className="aspect-square bg-[#333539] rounded flex items-center justify-center font-condensed text-[12px] text-[#c4c9ac]">10</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">11</div>
            <div className="aspect-square bg-[#c3f400]/80 rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">12</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">13</div>
            <div className="aspect-square bg-[#333539]/40 rounded flex items-center justify-center font-condensed text-[12px] text-[#8e9379]">14</div>

            {/* Week 3 */}
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">15</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">16</div>
            <div className="aspect-square bg-[#c3f400]/80 rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">17</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">18</div>
            <div className="aspect-square bg-[#333539] rounded flex items-center justify-center font-condensed text-[12px] text-[#c4c9ac]">19</div>
            <div className="aspect-square bg-[#c3f400]/90 rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">20</div>
            <div className="aspect-square bg-[#333539]/40 rounded flex items-center justify-center font-condensed text-[12px] text-[#8e9379]">21</div>

            {/* Week 4 */}
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">22</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">23</div>
            <div className="aspect-square bg-[#c3f400]/70 rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">24</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">25</div>
            <div className="aspect-square bg-[#c3f400] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-bold">26</div>
            <div className="aspect-square bg-[#333539] rounded flex items-center justify-center font-condensed text-[12px] text-[#c4c9ac]">27</div>
            <div className="aspect-square bg-[#333539]/40 rounded flex items-center justify-center font-condensed text-[12px] text-[#8e9379]">28</div>

            {/* Week 5 */}
            <div className="aspect-square bg-[#c3f400] ring-2 ring-[#c3f400] ring-offset-2 ring-offset-[#111317] rounded flex items-center justify-center font-condensed text-[12px] text-[#0c0e12] font-extrabold">29</div>
            <div className="aspect-square bg-[#1e2024] border border-[#444933]/30 rounded flex items-center justify-center font-condensed text-[12px] text-[#c4c9ac]">30</div>
            <div className="aspect-square bg-[#1e2024] border border-[#444933]/30 rounded flex items-center justify-center font-condensed text-[12px] text-[#c4c9ac]">31</div>
            <div className="aspect-square opacity-10"></div>
            <div className="aspect-square opacity-10"></div>
            <div className="aspect-square opacity-10"></div>
            <div className="aspect-square opacity-10"></div>
          </div>

          <p className="font-inter text-xs text-[#c4c9ac] text-center mt-3 pt-2 border-t border-white/5">
            🔥 <strong className="text-white">18 WODs registrados</strong> con intensidad promedio 8.7/10
          </p>
        </section>

        {/* Medallas & Logros */}
        <section>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-condensed text-[16px] uppercase tracking-wider text-white font-bold">
              Medallas & Logros
            </h3>
            <span className="font-condensed text-[12px] text-[#c4c9ac] uppercase">
              3 / 12 Desbloqueados
            </span>
          </div>

          <div className="space-y-2">
            {/* Medalla 1 */}
            <div className="flex items-center p-3 bg-[#1e2024] border border-[#444933]/20 rounded-xl space-x-3">
              <div className="w-11 h-11 rounded-lg bg-[#0c0e12] border border-[#c3f400]/40 flex items-center justify-center shrink-0 neon-glow">
                <span
                  className="material-symbols-outlined text-[#c3f400] text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  sports_kabaddi
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-condensed text-[17px] uppercase text-white font-bold">
                    Bestia del WOD
                  </h4>
                  <span className="font-condensed text-[12px] text-[#c3f400] uppercase font-bold">
                    Nivel 2
                  </span>
                </div>
                <p className="font-inter text-xs text-[#c4c9ac]">
                  50 WODs completados con registro oficial de marcas en box.
                </p>
              </div>
            </div>

            {/* Medalla 2 */}
            <div className="flex items-center p-3 bg-[#1e2024] border border-[#fb5b1b]/30 rounded-xl space-x-3 orange-glow">
              <div className="w-11 h-11 rounded-lg bg-[#0c0e12] border border-[#fb5b1b]/40 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[#fb5b1b] text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  military_tech
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-condensed text-[17px] uppercase text-white font-bold">
                    Racha de Hierro
                  </h4>
                  <span className="font-condensed text-[12px] text-[#fb5b1b] uppercase font-bold">
                    Completado
                  </span>
                </div>
                <p className="font-inter text-xs text-[#c4c9ac]">
                  10 días seguidos de asistencia ininterrumpida sin penalización.
                </p>
              </div>
            </div>

            {/* Medalla 3 */}
            <div className="flex items-center p-3 bg-[#1e2024] border border-[#444933]/20 rounded-xl space-x-3">
              <div className="w-11 h-11 rounded-lg bg-[#0c0e12] border border-[#00dbe9]/40 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[#00dbe9] text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  fitness_center
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-condensed text-[17px] uppercase text-white font-bold">
                    Club de los 100kg
                  </h4>
                  <span className="font-condensed text-[12px] text-[#00dbe9] uppercase font-bold">
                    Clean PR
                  </span>
                </div>
                <p className="font-inter text-xs text-[#c4c9ac]">
                  Levantamiento olímpico superado: 102.5 KG validado por coach.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Datos Personales & Médicos (Acordeón expandible) */}
        <section className="bg-[#1e2024] border border-[#444933]/20 rounded-xl overflow-hidden">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#282a2e] transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#c3f400]">health_and_safety</span>
              <span className="font-condensed text-[15px] uppercase tracking-wider text-white font-bold">
                Ficha Antropométrica & Médica
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[#c4c9ac] transition-transform duration-200 ${
                isAccordionOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {isAccordionOpen && (
            <div className="p-3.5 pt-0 space-y-3 border-t border-white/5">
              {/* Métricas Corporales */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-[#1a1c20] p-2.5 rounded-lg border border-white/5 text-center">
                  <span className="font-condensed text-[12px] uppercase text-[#c4c9ac]">Peso</span>
                  <div className="font-condensed text-[20px] font-bold text-white">
                    {currentMember.weightKg} <span className="text-[12px] text-[#c4c9ac]">KG</span>
                  </div>
                </div>
                <div className="bg-[#1a1c20] p-2.5 rounded-lg border border-white/5 text-center">
                  <span className="font-condensed text-[12px] uppercase text-[#c4c9ac]">Altura</span>
                  <div className="font-condensed text-[20px] font-bold text-white">
                    {currentMember.heightCm} <span className="text-[12px] text-[#c4c9ac]">CM</span>
                  </div>
                </div>
                <div className="bg-[#1a1c20] p-2.5 rounded-lg border border-white/5 text-center">
                  <span className="font-condensed text-[12px] uppercase text-[#c4c9ac]">% Grasa</span>
                  <div className="font-condensed text-[20px] font-bold text-[#c3f400]">
                    {currentMember.bodyFatPercent}
                    <span className="text-[12px]">%</span>
                  </div>
                </div>
              </div>

              {/* Contacto y Certificado */}
              <div className="space-y-1.5 font-inter text-xs text-[#c4c9ac]">
                <div className="flex items-center justify-between p-2 rounded bg-[#0c0e12]">
                  <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined text-[18px] text-[#fb5b1b]">
                      e911_emergency
                    </span>
                    <span className="text-white font-medium">Contacto de Emergencia</span>
                  </div>
                  <span className="truncate max-w-[150px]">{currentMember.emergencyContact}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#0c0e12]">
                  <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined text-[18px] text-[#c3f400]">
                      verified_user
                    </span>
                    <span className="text-white font-medium">Certificado Médico RX</span>
                  </div>
                  <span className="text-[#c3f400] font-semibold">
                    {currentMember.medicalCertificateValidUntil}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Accesos Rápidos de Configuración */}
        <section className="bg-[#1e2024] border border-[#444933]/20 rounded-xl divide-y divide-[#444933]/20 overflow-hidden">
          {/* Toggle Notificaciones */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-[#c4c9ac]">alarm</span>
              <div>
                <h5 className="font-condensed text-[15px] uppercase text-white font-bold">
                  Recordatorios de Clases
                </h5>
                <p className="font-inter text-xs text-[#c4c9ac]">Aviso 1 hora antes de iniciar tu WOD</p>
              </div>
            </div>
            <button
              onClick={toggleReminders}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                classReminders ? 'bg-[#c3f400]' : 'bg-[#333539]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#111317] absolute top-0.5 transition-transform ${
                  classReminders ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Toggle Sincronización Salud */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-[#c4c9ac]">favorite</span>
              <div>
                <h5 className="font-condensed text-[15px] uppercase text-white font-bold">
                  Apple Health / Google Fit
                </h5>
                <p className="font-inter text-xs text-[#c4c9ac]">
                  Sincronizar calorías y frecuencia cardíaca
                </p>
              </div>
            </div>
            <button
              onClick={toggleHealth}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                healthSync ? 'bg-[#c3f400]' : 'bg-[#333539]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#111317] absolute top-0.5 transition-transform ${
                  healthSync ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Cerrar Sesión */}
          <button
            onClick={handleSignOutClick}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#282a2e] transition-colors group cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-[#fb5b1b]">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-condensed text-[15px] uppercase tracking-wider font-extrabold">
                {authUser ? 'Cerrar Sesión' : 'Iniciar Sesión / Cambiar Cuenta'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#c4c9ac] group-hover:text-[#fb5b1b] transition-colors">
              chevron_right
            </span>
          </button>
        </section>

        {/* Versión del Sistema */}
        <div className="text-center py-2">
          <p className="font-condensed text-[12px] uppercase text-[#8e9379] tracking-wider font-semibold">
            FITBOX OS V4.8.2 • LICENCIA BOX OFICIAL
          </p>
        </div>
      </main>

      {/* QR Modal for General Access */}
      {showQrModal && (
        <QrPassModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
      )}

      {/* QR Modal for specific Class Booking */}
      {selectedBookingForQr && (
        <QrPassModal
          isOpen={!!selectedBookingForQr}
          onClose={() => setSelectedBookingForQr(null)}
          bookingInfo={selectedBookingForQr}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};
