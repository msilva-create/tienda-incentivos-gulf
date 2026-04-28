
import React, { useMemo } from 'react';
import { User, MonthlyRecord } from '../types';
import { RAW_USERS } from '../users';
import { MOTIVATIONAL_MESSAGES } from '../constants';
import { TrendingUp, DollarSign, Fuel, Award, Trophy, Flag, Timer, ChevronRight, History, Calendar, Info } from 'lucide-react';

interface DashboardProps {
  user: User;
  users: User[];
  monthlyRecords: MonthlyRecord[];
  onGoToCatalog: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, users, monthlyRecords, onGoToCatalog }) => {
  const isCentralGulf = user.distributor === 'CENTRAL GULF' || user.distributor === 'GULF CENTRAL' || user.role === 'ADMIN';

  const teamRanking = useMemo(() => {
    return users
      .filter((u) => u.distributor.toUpperCase().includes(user.distributor.toUpperCase()) && u.role === 'COMMERCIAL')
      .sort((a, b) => b.gallons - a.gallons);
  }, [user.distributor, users]);

  const userPosition = teamRanking.findIndex((u) => u.id === user.id) + 1;
  const message = useMemo(() => {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const target = 1500;
  const progressPercent = Math.min((user.gallons / target) * 100, 100);

  const myMonthlyRecords = useMemo(() => {
    return monthlyRecords
      .filter(r => r.userId === user.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [monthlyRecords, user.id]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-gulf">
      {/* Motivational Fixed Message */}
      <div className="bg-[#002F6C] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-b-[6px] border-[#FF6A00]">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Fuel size={200} className="text-white" />
        </div>
        
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#FF6A00] px-4 py-1.5 rounded-full mb-4">
            <Trophy size={14} className="text-white" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Estatus de Carrera</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter leading-none mb-2">
            “{message.toUpperCase()}”
          </h2>
          <p className="text-blue-200 text-sm font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
            <span className="w-8 h-1 bg-white rounded-full"></span> Vender GULF sí paga
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-center gap-8">
           {isCentralGulf && (
             <>
               <div className="text-center">
                 <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Posición</p>
                 <p className="text-4xl font-black text-[#FF6A00] italic">#{userPosition}</p>
               </div>
               <div className="w-px h-10 bg-white/20"></div>
             </>
           )}
           <div className="text-center">
             <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Nivel</p>
             <p className="text-4xl font-black text-white italic">{user.gallons > 1000 ? 'ELITE' : 'PRO'}</p>
           </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className={`grid grid-cols-1 ${isCentralGulf ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
        {/* Gallons Accumulation */}
        <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#FF6A00] transition-all">
          <div className="absolute top-0 left-0 w-full h-2 racing-stripe-header opacity-20"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#002F6C]">
              <Fuel size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Galones vendidos</p>
              <p className="text-3xl font-black text-[#002F6C] italic">{user.gallons.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between items-end">
               <span className="text-[10px] font-black text-slate-500 uppercase">Progreso de Meta</span>
               <span className="text-xs font-black text-[#FF6A00]">{Math.round(progressPercent)}%</span>
             </div>
             <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
               <div 
                className="h-full bg-gradient-to-r from-[#002F6C] to-[#FF6A00] rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
               ></div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
               Siguiente meta: 1,500 Galones
             </p>
          </div>
        </div>

        {/* Balance Accumulation - Oculto para Central Gulf */}
        {!isCentralGulf && (
          <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#FF6A00] transition-all">
            <div className="absolute top-0 left-0 w-full h-2 racing-stripe-header opacity-20"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6A00]">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Saldo Disponible</p>
                <p className="text-3xl font-black text-[#002F6C] italic">{formatCurrency(user.balance)}</p>
              </div>
            </div>
            <button 
              onClick={onGoToCatalog}
              className="w-full bg-[#002F6C] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#003d8c] transition-colors flex items-center justify-center gap-2"
            >
              <Trophy size={16} className="text-[#FF6A00]" /> Ver Premios
            </button>
          </div>
        )}

        {/* Direct Redem Card for Central Gulf or Motivation Card */}
        {isCentralGulf ? (
          <div className="bg-orange-50 rounded-[2rem] p-8 border-2 border-[#FF6A00]/20 flex flex-col justify-center relative overflow-hidden group hover:border-[#FF6A00] transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A00]/5 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-[#002F6C] font-black uppercase tracking-[0.2em] text-xs">Redención Directa</h4>
              <p className="text-slate-600 text-sm font-bold uppercase italic leading-tight">
                No necesitas saldo previo. Elige tu premio y genera la solicitud hoy mismo.
              </p>
              <button 
                onClick={onGoToCatalog}
                className="btn-gulf w-full py-4 rounded-2xl shadow-lg shadow-orange-200"
              >
                IR A LA TIENDA
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-slate-100 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6A00]/5 rounded-full -translate-y-12 translate-x-12"></div>
             <h4 className="text-[#002F6C] font-black uppercase tracking-[0.2em] text-xs mb-4">Telemetría de Ventas</h4>
             <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-4 border-[#FF6A00] pl-4">
               "Cada galón que entregas hoy, es un paso firme hacia el premio que mereces mañana. ¡Pisa a fondo el acelerador!"
             </p>
          </div>
        )}
      </div>

      {/* Monthly History Section - Visible for Commercials */}
      {!isCentralGulf && (
        <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm animate-gulf">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#002F6C]">
                <History size={20} />
              </div>
              <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-sm">Mi Historial de Incentivos</h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Info size={12} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saldos calculados por Central Gulf</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Mes</th>
                  <th className="px-6 py-4 text-center">Galones Vendidos</th>
                  <th className="px-6 py-4 text-center">Valor por Galón</th>
                  <th className="px-6 py-4 text-right">Saldo Cargado</th>
                  <th className="px-6 py-4">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {user.initialBalance > 0 && (
                  <tr className="bg-slate-50/20 italic">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award size={12} className="text-[#002F6C]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">Saldo Inicial (Migración)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[10px] font-black text-slate-400 italic">{user.initialGallons.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[10px] font-black text-slate-400 italic">-</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-[10px] font-black text-slate-400 italic">{formatCurrency(user.initialBalance)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[9px] text-slate-300 font-medium italic">Saldo base antes del sistema mensual</p>
                    </td>
                  </tr>
                )}
                {myMonthlyRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50/10 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#FF6A00]" />
                        <span className="text-xs font-black text-[#002F6C] uppercase">{record.month}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs font-black text-slate-900 italic">{record.gallonsSold.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs font-black text-slate-500 italic">{formatCurrency(record.valuePerGallon)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs font-black text-[#FF6A00] italic">{formatCurrency(record.amountLoaded)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-slate-400 font-medium italic">{record.observations || 'Sin observaciones'}</p>
                    </td>
                  </tr>
                ))}
                {myMonthlyRecords.length === 0 && user.initialBalance === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-black uppercase text-xs">Aún no tienes registros de saldos cargados</td>
                  </tr>
                )}
              </tbody>
              {(myMonthlyRecords.length > 0 || user.initialBalance > 0) && (
                <tfoot>
                  <tr className="bg-slate-50/30">
                    <td colSpan={3} className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase">Total Cargado Histórico:</td>
                    <td className="px-6 py-4 text-right text-sm font-black text-[#002F6C] italic">
                      {formatCurrency((user.initialBalance || 0) + myMonthlyRecords.reduce((sum, r) => sum + r.amountLoaded, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
