import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { authUser, currentMember, signInGoogle, signOutUser, loadDemoUser } = useGym();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      await signInGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al iniciar sesión con Google.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOut = async () => {
    setIsProcessing(true);
    try {
      await signOutUser();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al cerrar sesión.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e2024] border border-[#c3f400]/40 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-left relative neon-glow">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#333539] text-[#e2e2e8] flex items-center justify-center hover:bg-[#c3f400] hover:text-[#111317] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 text-[#c3f400] mb-1">
          <span className="material-symbols-outlined text-[22px]">fitness_center</span>
          <span className="font-condensed font-bold text-[14px] uppercase tracking-wider">
            PORTAL DEL SOCIO FITBOX
          </span>
        </div>
        <h3 className="font-condensed text-[24px] font-extrabold uppercase text-white tracking-wide">
          {authUser ? 'SESIÓN DE SOCIO' : 'ACCESO DE ATLETAS'}
        </h3>
        <p className="text-xs text-[#c4c9ac] font-inter">
          Autenticación segura conectada con Firebase Auth & Firestore.
        </p>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-inter">
            {errorMsg}
          </div>
        )}

        {authUser ? (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-white/10 flex items-center gap-3">
              <img
                src={authUser.photoURL || currentMember.avatarUrl}
                alt="Avatar"
                className="w-12 h-12 rounded-full border border-[#c3f400] object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-white font-bold text-sm truncate">{authUser.displayName || currentMember.name}</h4>
                <p className="text-xs text-[#c4c9ac] truncate">{authUser.email}</p>
                <span className="inline-block mt-1 font-condensed text-[11px] uppercase px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] font-bold">
                  Socio Verificado: {currentMember.memberId}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-lg border border-[#fb5b1b] text-[#fb5b1b] hover:bg-[#fb5b1b]/10 font-condensed font-bold text-[15px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>{isProcessing ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-white text-black font-inter font-semibold text-sm hover:bg-neutral-200 active:scale-98 transition-all flex items-center justify-center gap-3 shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isProcessing ? 'Conectando...' : 'Iniciar con Google (Firebase Auth)'}</span>
            </button>

            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full border-t border-white/10"></div>
              <span className="bg-[#1e2024] px-2 text-[11px] font-condensed uppercase text-[#c4c9ac] absolute">
                O CONTINUAR CON SOCIO DEMO
              </span>
            </div>

            <button
              onClick={() => {
                loadDemoUser();
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-bold text-[15px] uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span>Continuar como Alex Mendoza (Socio #FB-8942)</span>
            </button>

            <p className="text-[11px] text-[#c4c9ac] text-center font-inter pt-1">
              Todos los datos de clases, reservas y pagos se sincronizan en tiempo real con Cloud Firestore.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
