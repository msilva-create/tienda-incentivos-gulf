
import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types';
import { RAW_USERS } from '../users';
import { ShieldAlert, Zap, ChevronLeft, Building2, KeyRound, ChevronRight, ArrowRight, UserCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

type LoginStep = 'home' | 'distributor' | 'commercial' | 'password' | 'admin_secure';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('home');
  const [selectedDistributor, setSelectedDistributor] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [error, setError] = useState('');
  const [logoClicks, setLogoClicks] = useState(0);

  // Reset logo clicks after 5 seconds of inactivity
  useEffect(() => {
    if (logoClicks > 0) {
      const timer = setTimeout(() => setLogoClicks(0), 5000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  const distributors = useMemo(() => {
    // Only show distributors that have commercial users
    return [
      "CENTRAL GULF", 
      "LUBRICAFE",
      "MAQUINAGRO", 
      "JAIRO SÁNCHEZ", 
      "UNIVERSAL", 
      "DISTRIBUIDORA LOS LAGOS",
      "GRUPO MOTOR",
      "RAMOS DISTRIBUCIONES",
      "PRUEBA"
    ];
  }, []);

  const commercials = useMemo(() => {
    const normalizedSelected = selectedDistributor.toUpperCase();
    return RAW_USERS.filter(u => 
      u.distributor.toUpperCase().includes(normalizedSelected) && 
      u.role === 'COMMERCIAL'
    );
  }, [selectedDistributor]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    // Validación estricta de contraseña comercial
    if (selectedUser && selectedUser.password === password) {
      onLogin(selectedUser);
    } else {
      setError('Clave incorrecta. Acceso restringido.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // VALIDACIÓN ESTRICTA ADMINISTRADOR CENTRAL
    const adminUser = RAW_USERS.find(u => u.email === 'admin.gulf' && u.role === 'ADMIN');
    
    if (adminEmail === 'admin.gulf' && password === 'AdminGulf2026' && adminUser) {
      onLogin(adminUser);
    } else {
      setError('Acceso no autorizado.');
    }
  };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount === 5) {
      setStep('admin_secure');
      setLogoClicks(0);
      setError('');
      setPassword('');
    }
  };

  const LogoHeader = () => (
    <div className="flex flex-col items-center mb-10 w-full cursor-pointer select-none" onClick={handleLogoClick}>
      <img 
        src="https://i.postimg.cc/SQ0kdm6y/Logo-GULF-2.png" 
        alt="Gulf Logo" 
        style={{ height: '120px', width: 'auto', display: 'block', margin: '0 auto' }}
      />
    </div>
  );

  const renderHomeStep = () => (
    <div className="animate-gulf space-y-8 max-w-lg mx-auto text-center">
      <div>
        <h1 className="text-[#002F6C] font-black text-4xl sm:text-5xl italic tracking-tighter mb-4 leading-none">
          VENDE GULF Y GANA
        </h1>
        <p className="text-slate-600 font-medium text-lg px-4">
          Cada galón Gulf que vendes te acerca a ganar más.<br/>
          Convierte tu esfuerzo en premios reales.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,47,108,0.15)] border-2 border-slate-50 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#FF6A00]"></div>
        <h2 className="text-[#002F6C] font-black uppercase tracking-[0.2em] text-sm mb-6 flex items-center justify-center gap-2">
          <Building2 size={16} className="text-[#FF6A00]" />
          DISTRIBUIDOR
        </h2>
        <button
          onClick={() => setStep('distributor')}
          className="btn-gulf w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-lg shadow-orange-200"
        >
          INGRESAR A LA TIENDA <ArrowRight size={20} />
        </button>
      </div>

      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] pt-4">
        PROGRAMA DE INCENTIVOS PROLUB
      </p>
    </div>
  );

  const renderDistributorStep = () => (
    <div className="animate-gulf space-y-6">
      <div className="text-center">
        <h3 className="text-[#002F6C] font-black text-2xl uppercase tracking-tight mb-2">Selecciona tu distribuidor para comenzar</h3>
        <div className="h-1 w-16 bg-[#FF6A00] mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {distributors.map((dist) => (
          <button
            key={dist}
            onClick={() => {
              setSelectedDistributor(dist);
              setStep('commercial');
            }}
            className="gulf-card bg-white p-6 rounded-3xl text-left flex flex-col justify-between group h-40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Building2 size={64} />
            </div>
            <Building2 className="text-[#002F6C] group-hover:text-[#FF6A00] transition-colors" size={32} />
            <div>
              <h4 className="font-black text-[#002F6C] uppercase tracking-tighter text-lg leading-none mb-2">{dist}</h4>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#FF6A00]">INGRESAR</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button onClick={() => setStep('home')} className="text-slate-400 hover:text-[#002F6C] text-xs font-bold uppercase flex items-center gap-2 transition-colors">
          <ChevronLeft size={14} /> Volver al Inicio
        </button>
      </div>
    </div>
  );

  const renderCommercialStep = () => (
    <div className="animate-gulf space-y-6">
      <div className="text-center">
        <h3 className="text-[#002F6C] font-black text-2xl uppercase tracking-tight mb-1">Selecciona tu nombre</h3>
        <p className="text-[#FF6A00] text-[10px] font-black uppercase tracking-[0.2em]">{selectedDistributor}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {commercials.map((comm) => (
          <button
            key={comm.id}
            onClick={() => {
              setSelectedUser(comm);
              setStep('password');
            }}
            className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border-2 border-transparent hover:border-[#FF6A00] hover:bg-white transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#002F6C] font-black italic text-xl group-hover:bg-[#002F6C] group-hover:text-white transition-all shadow-sm">
              {comm.name.charAt(0)}
            </div>
            <span className="font-black text-[#002F6C] uppercase tracking-tight text-lg">{comm.name}</span>
            <ChevronRight size={20} className="ml-auto text-slate-300 group-hover:text-[#FF6A00]" />
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button onClick={() => setStep('distributor')} className="text-slate-400 hover:text-[#002F6C] text-xs font-bold uppercase flex items-center gap-2 transition-colors">
          <ChevronLeft size={14} /> Cambiar Distribuidor
        </button>
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="animate-gulf space-y-6 max-w-sm mx-auto">
      <div className="text-center">
        <h3 className="text-[#002F6C] font-black text-2xl uppercase tracking-tight mb-1">Ingresa tu clave para ver tu avance</h3>
        <p className="text-slate-500 font-bold text-sm uppercase italic">{selectedUser?.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl flex items-center gap-3 animate-shake">
            <ShieldAlert className="text-red-500 w-5 h-5 flex-shrink-0" />
            <p className="text-red-700 text-xs font-bold uppercase tracking-tighter">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clave de Seguridad</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <KeyRound size={20} className="text-slate-300" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-14 pr-5 py-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:bg-white transition-all font-black text-[#002F6C] tracking-[0.4em] text-center"
              autoFocus
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-gulf w-full py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-100">
          <Zap size={18} fill="currentColor" /> INGRESAR
        </button>
      </form>

      <div className="flex justify-center pt-4">
        <button onClick={() => setStep('commercial')} className="text-slate-400 hover:text-[#002F6C] text-xs font-bold uppercase flex items-center gap-2 transition-colors">
          <ChevronLeft size={14} /> Cambiar Comercial
        </button>
      </div>
    </div>
  );

  const renderAdminSecureStep = () => (
    <div className="animate-gulf space-y-6 max-w-sm mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#002F6C] rounded-2xl flex items-center justify-center text-[#FF6A00] mx-auto mb-4 shadow-xl">
           <UserCircle size={40} />
        </div>
        <h3 className="text-[#002F6C] font-black text-2xl uppercase tracking-tight mb-1">Gestión Central</h3>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Solo Personal Autorizado</p>
      </div>

      <form onSubmit={handleAdminSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl flex items-center gap-3 animate-shake">
            <ShieldAlert className="text-red-500 w-5 h-5 flex-shrink-0" />
            <p className="text-red-700 text-xs font-bold uppercase tracking-tighter">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email de Usuario</label>
          <input
            type="text"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="usuario@gulf.com"
            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#002F6C] focus:bg-white transition-all font-black text-[#002F6C] tracking-widest"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clave Administrador</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#002F6C] focus:bg-white transition-all font-black text-[#002F6C] tracking-[0.4em]"
            required
          />
        </div>

        <button type="submit" className="w-full py-5 rounded-2xl bg-[#002F6C] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-[#003d8c] transition-all">
          AUTENTICAR
        </button>
      </form>

      <div className="flex justify-center pt-4">
        <button onClick={() => setStep('home')} className="text-slate-400 hover:text-[#002F6C] text-xs font-bold uppercase flex items-center gap-2 transition-colors">
          <ChevronLeft size={14} /> Volver
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 w-full racing-stripe-header"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#002F6C] opacity-[0.02] rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF6A00] opacity-[0.02] rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-4xl z-10 py-12">
        <LogoHeader />
        
        <div className="min-h-[400px] flex flex-col justify-center">
          {step === 'home' && renderHomeStep()}
          {step === 'distributor' && renderDistributorStep()}
          {step === 'commercial' && renderCommercialStep()}
          {step === 'password' && renderPasswordStep()}
          {step === 'admin_secure' && renderAdminSecureStep()}
        </div>
      </div>

      {/* FOOTER ACTUALIZADO: Sin bypass de administrador para comerciales */}
      <footer className="mt-auto py-8 text-center">
        <p className="text-[10px] font-black text-[#002F6C] opacity-20 uppercase tracking-[0.4em]">
          Plataforma de Incentivos GULF v2.1
        </p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF6A00; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
};

export default Login;
