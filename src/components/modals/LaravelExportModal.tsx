import React, { useState } from 'react';

interface LaravelExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelExportModal: React.FC<LaravelExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'filament' | 'blade' | 'models' | 'routes'>('info');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e2024] border-2 border-[#c3f400] rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative neon-glow">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141619]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-2xl">code_blocks</span>
            <div>
              <h3 className="font-condensed text-lg font-extrabold uppercase text-white tracking-wider">
                PROYECTO LARAVEL 13 + BLADE & FILAMENT 5
              </h3>
              <p className="text-[11px] text-[#c4c9ac] font-inter">Código completo generado en la carpeta /laravel-app/</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#282a2e] text-white flex items-center justify-center hover:bg-[#c3f400] hover:text-[#111317] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-5 bg-[#0c0e12] border-b border-white/5 font-condensed text-xs uppercase font-bold text-center">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 cursor-pointer transition-colors ${activeTab === 'info' ? 'bg-[#c3f400] text-[#111317]' : 'text-[#c4c9ac] hover:text-white'}`}
          >
            Guía / Setup
          </button>
          <button
            onClick={() => setActiveTab('filament')}
            className={`py-2 px-1 cursor-pointer transition-colors ${activeTab === 'filament' ? 'bg-[#c3f400] text-[#111317]' : 'text-[#c4c9ac] hover:text-white'}`}
          >
            Filament 5
          </button>
          <button
            onClick={() => setActiveTab('blade')}
            className={`py-2 px-1 cursor-pointer transition-colors ${activeTab === 'blade' ? 'bg-[#c3f400] text-[#111317]' : 'text-[#c4c9ac] hover:text-white'}`}
          >
            Blade Views
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`py-2 px-1 cursor-pointer transition-colors ${activeTab === 'models' ? 'bg-[#c3f400] text-[#111317]' : 'text-[#c4c9ac] hover:text-white'}`}
          >
            Modelos
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`py-2 px-1 cursor-pointer transition-colors ${activeTab === 'routes' ? 'bg-[#c3f400] text-[#111317]' : 'text-[#c4c9ac] hover:text-white'}`}
          >
            Rutas
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 font-inter text-xs text-[#e2e2e8] space-y-3">
          {activeTab === 'info' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#0c0e12] border border-[#c3f400]/30 space-y-2">
                <span className="font-condensed font-extrabold uppercase text-[#c3f400] text-sm">
                  1. Pasos de Instalación en tu Servidor / Local
                </span>
                <p className="text-[#c4c9ac]">
                  Los archivos ya están creados en tu proyecto bajo <code className="text-[#c3f400]">/laravel-app/</code>:
                </p>
                <pre className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-green-300 overflow-x-auto">
{`cd laravel-app
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan make:filament-user
php artisan serve`}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-[#0c0e12] border border-white/5 space-y-1.5">
                <span className="font-condensed font-bold uppercase text-white text-sm">
                  2. Estructura de Archivos Creados
                </span>
                <ul className="list-disc list-inside text-[#c4c9ac] space-y-1">
                  <li><strong className="text-white">Back-end Filament:</strong> <code>app/Filament/Resources/GymClassResource.php</code>, <code>BookingResource.php</code>, <code>MemberResource.php</code>, <code>PlanResource.php</code></li>
                  <li><strong className="text-white">Plantillas Blade:</strong> <code>resources/views/layouts/app.blade.php</code>, <code>classes/index.blade.php</code>, <code>profile/index.blade.php</code>, <code>membership/index.blade.php</code>, <code>wod/index.blade.php</code></li>
                  <li><strong className="text-white">Controladores:</strong> <code>ClassController.php</code>, <code>ProfileController.php</code>, <code>MembershipController.php</code>, <code>WodController.php</code></li>
                  <li><strong className="text-white">Migraciones:</strong> <code>create_fitbox_tables.php</code> (Planes, Socios, Clases, Reservas, PRs, Facturas)</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'filament' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-condensed text-sm font-bold uppercase text-[#c3f400]">Panel de Administración Filament 5</span>
                <span className="text-[11px] text-[#c4c9ac]">app/Filament/Resources/</span>
              </div>
              <p className="text-[#c4c9ac]">
                Filament 5 proporciona el panel completo con autenticación administrativa, métricas en vivo, validación de torreta por QR, CRUD de clases, cupos y lista de espera.
              </p>
              <div className="p-3 rounded-xl bg-[#0c0e12] border border-white/10 space-y-2">
                <span className="font-bold text-white block">GymClassResource.php</span>
                <p className="text-[#c4c9ac] text-[11px]">
                  Permite a los administradores y coaches publicar clases, fijar horarios, límite de aforo (ej. 16 personas) y ver en tiempo real cuántas plazas quedan.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#0c0e12] border border-white/10 space-y-2">
                <span className="font-bold text-white block">BookingResource.php</span>
                <p className="text-[#c4c9ac] text-[11px]">
                  Control de reservas, asistencia con botón de check-in que suma al cómputo de asistencias del socio y validación del código de pase <code>#4920</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'blade' && (
            <div className="space-y-3">
              <span className="font-condensed text-sm font-bold uppercase text-[#c3f400] block">Vistas Blade Frontend</span>
              <p className="text-[#c4c9ac]">
                Todas las pantallas de la app deportiva de socios con Tailwind CSS y el diseño atlético de alto contraste:
              </p>
              <ul className="space-y-2">
                <li className="p-2.5 rounded-lg bg-[#0c0e12] border border-white/5">
                  <span className="font-bold text-white block">resources/views/layouts/app.blade.php</span>
                  <span className="text-[#c4c9ac] text-[11px]">Layout responsivo móvil con barra de navegación inferior fija y alertas flash.</span>
                </li>
                <li className="p-2.5 rounded-lg bg-[#0c0e12] border border-white/5">
                  <span className="font-bold text-white block">resources/views/classes/index.blade.php</span>
                  <span className="text-[#c4c9ac] text-[11px]">Selector de fechas con slider (LUN a DOM), filtros de categorías y reserva atómica.</span>
                </li>
                <li className="p-2.5 rounded-lg bg-[#0c0e12] border border-white/5">
                  <span className="font-bold text-white block">resources/views/profile/index.blade.php</span>
                  <span className="text-[#c4c9ac] text-[11px]">Carnet Digital interactivo con código QR para el torno del box y la sección <strong>Mis Reservas (Activas y Pasadas)</strong>.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-2">
              <span className="font-condensed text-sm font-bold uppercase text-[#c3f400] block">Modelos Eloquent en app/Models/</span>
              <div className="p-2.5 rounded bg-[#0c0e12] border border-white/5 space-y-1">
                <span className="font-bold text-white block">GymClass &lt;-&gt; Booking &lt;-&gt; Member</span>
                <p className="text-[#c4c9ac] text-[11px]">
                  Relaciones <code>hasMany</code> y <code>belongsTo</code> con métodos como <code>getAvailableSpotsAttribute()</code> y bloqueos pesimistas en base de datos (<code>lockForUpdate()</code>) para evitar sobrecupos concurrentes.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-2">
              <span className="font-condensed text-sm font-bold uppercase text-[#c3f400] block">routes/web.php</span>
              <pre className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-green-300 overflow-x-auto">
{`Route::get('/clases', [ClassController::class, 'index'])->name('classes.index');
Route::post('/clases/{classId}/reservar', [ClassController::class, 'reserve'])->name('classes.reserve');
Route::post('/clases/{classId}/cancelar', [ClassController::class, 'cancel'])->name('classes.cancel');
Route::post('/clases/{classId}/espera', [ClassController::class, 'waitlist'])->name('classes.waitlist');

Route::get('/wod', [WodController::class, 'index'])->name('wod.index');
Route::post('/wod/pr', [WodController::class, 'storePr'])->name('wod.pr.store');

Route::get('/cuota', [MembershipController::class, 'index'])->name('membership.index');
Route::post('/cuota/cambiar', [MembershipController::class, 'changePlan'])->name('membership.change');

Route::get('/perfil', [ProfileController::class, 'index'])->name('profile.index');
Route::post('/perfil/actualizar', [ProfileController::class, 'update'])->name('profile.update');`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#141619] border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-[#c4c9ac]">Archivos en: <code>/laravel-app/</code></span>
          <button
            onClick={() => copyToClipboard('cd laravel-app && composer install && php artisan migrate && php artisan serve')}
            className="px-3 py-1.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-extrabold uppercase text-xs flex items-center gap-1 cursor-pointer hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copied ? '¡Comando Copiado!' : 'Copiar Comandos'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
