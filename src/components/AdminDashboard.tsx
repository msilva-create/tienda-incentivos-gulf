import React, { useMemo, useState } from 'react';
import { RAW_USERS } from '../users';
import { User, MonthlyRecord, Order, OrderStatus, RedeemedItem } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Plus, Trash2, X,
  TrendingUp, Users, Search, Filter, 
  Fuel, Trophy, LayoutDashboard, Building2,
  DollarSign, Award, 
  Calendar, Edit2, History, ShoppingCart,
  FileDown, Gift
} from 'lucide-react';

type AdminTab = 'resumen' | 'distribuidores' | 'comerciales' | 'ranking' | 'historial' | 'pedidos' | 'saldos' | 'topredenciones';

interface AdminDashboardProps {
  users: User[];
  monthlyRecords: MonthlyRecord[];
  orders: Order[];
  redeemedItems?: RedeemedItem[];
  onAddMonthlyRecord: (record: Omit<MonthlyRecord, 'id' | 'date'>) => void;
  onUpdateMonthlyRecord: (record: MonthlyRecord) => void;
  onDeleteMonthlyRecord: (recordId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, monthlyRecords, orders, redeemedItems = [],
  onAddMonthlyRecord, onUpdateMonthlyRecord, onDeleteMonthlyRecord, onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('historial');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Marzo');
  const [selectedDistributor, setSelectedDistributor] = useState<string>('Global');
  const [filterDistributor, setFilterDistributor] = useState<string>('Todos');
  const [filterMonth, setFilterMonth] = useState<string>('Todos');
  const [saldosDistributor, setSaldosDistributor] = useState<string>('Todos');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ userId: '', month: 'Marzo', gallonsSold: 0, valuePerGallon: 100, observations: '' });

  const commercials = useMemo(() => users.filter(u => u.role === 'COMMERCIAL'), [users]);

  const distributorStats = useMemo(() => {
    const stats: Record<string, { name: string; gallons: number; balance: number; staff: number }> = {};
    commercials.forEach(c => {
      if (c.distributor === 'PRUEBA') return;
      if (!stats[c.distributor]) stats[c.distributor] = { name: c.distributor, gallons: 0, balance: 0, staff: 0 };
      stats[c.distributor].gallons += c.gallons;
      stats[c.distributor].balance += c.balance;
      stats[c.distributor].staff += 1;
    });
    return Object.values(stats).sort((a, b) => b.gallons - a.gallons);
  }, [commercials]);

  const distributors = useMemo(() => ['Todos', ...Array.from(new Set(commercials.map(c => c.distributor))).sort()], [commercials]);

  const globalStats = useMemo(() => {
    const real = commercials.filter(c => c.distributor !== 'PRUEBA');
    return {
      totalGallons: real.reduce((a, c) => a + c.gallons, 0),
      totalInvestment: real.reduce((a, c) => a + c.balance, 0),
      totalCommercials: real.length,
      totalDistributors: distributorStats.length
    };
  }, [commercials, distributorStats]);

  const filteredCommercials = useMemo(() => commercials
    .filter(c => {
      const ms = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const md = filterDistributor === 'Todos' || c.distributor === filterDistributor;
      return ms && md;
    }).sort((a, b) => b.gallons - a.gallons), [commercials, searchTerm, filterDistributor]);

  const filteredRecords = useMemo(() => monthlyRecords.filter(r => {
    const ms = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || r.distributor.toLowerCase().includes(searchTerm.toLowerCase());
    const md = filterDistributor === 'Todos' || r.distributor === filterDistributor;
    const mm = filterMonth === 'Todos' || r.month === filterMonth;
    return ms && md && mm;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [monthlyRecords, searchTerm, filterDistributor, filterMonth]);

  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const COLORS = ['#002F6C','#FF6A00','#004BB3','#E66000','#64748B','#0ea5e9'];

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  // Calcular total redimido por usuario
  const totalRedimidoByEmail = useMemo(() => {
    const map: Record<string, number> = {};
    redeemedItems.forEach(r => { map[r.userEmail] = (map[r.userEmail] || 0) + r.price; });
    orders.forEach(o => {
      if (!redeemedItems.find(r => r.id === o.id)) {
        map[o.userEmail] = (map[o.userEmail] || 0) + o.discountedBalance;
      }
    });
    return map;
  }, [redeemedItems, orders]);

  // PDF de saldos
  const handleDownloadPDF = (distFilter: string) => {
    const filtered = commercials.filter(c => c.distributor !== 'PRUEBA' && (distFilter === 'Todos' || c.distributor === distFilter));
    const date = new Date().toLocaleDateString('es-CO');
    
    const rows = filtered.map(c => `
      <tr>
        <td>${c.distributor}</td>
        <td>${c.name}</td>
        <td style="text-align:center">${c.gallons.toLocaleString()}</td>
        <td style="text-align:right;color:#FF6A00;font-weight:bold">${formatCurrency(c.balance)}</td>
        <td style="text-align:right;color:#dc2626">${formatCurrency(totalRedimidoByEmail[c.email] || 0)}</td>
      </tr>
    `).join('');

    const totalSaldo = filtered.reduce((s, c) => s + c.balance, 0);
    const totalRed = filtered.reduce((s, c) => s + (totalRedimidoByEmail[c.email] || 0), 0);

    const html = `
      <!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Saldos Gulf - ${distFilter}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 4px solid #FF6A00; padding-bottom: 20px; }
        h1 { color: #002F6C; font-size: 20px; margin: 0; text-transform: uppercase; }
        .subtitle { color: #64748b; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px; }
        .date { color: #64748b; font-size: 11px; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
        th { background: #002F6C; color: white; padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; }
        tr:nth-child(even) td { background: #f8fafc; }
        .total-row td { background: #002F6C; color: white; font-weight: bold; padding: 12px; }
        .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; }
      </style></head><body>
      <div class="header">
        <div>
          <h1>Reporte de Saldos Gulf</h1>
          <div class="subtitle">Programa de Incentivos "Vender GULF sí paga" · ${distFilter === 'Todos' ? 'Todos los distribuidores' : distFilter}</div>
        </div>
        <div class="date">Generado: ${date}</div>
      </div>
      <table>
        <thead><tr>
          <th>Distribuidor</th><th>Comercial</th><th style="text-align:center">Galones</th>
          <th style="text-align:right">Saldo Disponible</th><th style="text-align:right">Total Redimido</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr class="total-row">
          <td colspan="3">TOTAL GENERAL</td>
          <td style="text-align:right">${formatCurrency(totalSaldo)}</td>
          <td style="text-align:right">${formatCurrency(totalRed)}</td>
        </tr></tfoot>
      </table>
      <div class="footer">GULF Lubricantes © ${new Date().getFullYear()} · Confidencial</div>
      </body></html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) { win.onload = () => { win.print(); }; }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUser = users.find(u => u.id === formData.userId);
    if (!selectedUser) return;
    const amountLoaded = formData.gallonsSold * formData.valuePerGallon;
    if (editingRecordId) {
      const existing = monthlyRecords.find(r => r.id === editingRecordId);
      if (existing) onUpdateMonthlyRecord({ ...existing, month: formData.month, gallonsSold: formData.gallonsSold, valuePerGallon: formData.valuePerGallon, amountLoaded, observations: formData.observations });
      setEditingRecordId(null);
    } else {
      onAddMonthlyRecord({ userId: selectedUser.id, userName: selectedUser.name, distributor: selectedUser.distributor, month: formData.month, gallonsSold: formData.gallonsSold, valuePerGallon: formData.valuePerGallon, amountLoaded, redeemed: 0, availableBalance: amountLoaded, observations: formData.observations });
    }
    setFormData({ userId: '', month: 'Marzo', gallonsSold: 0, valuePerGallon: 100, observations: '' });
    setShowAddForm(false);
  };

  const handleEditRecord = (record: MonthlyRecord) => {
    setFormData({ userId: record.userId, month: record.month, gallonsSold: record.gallonsSold, valuePerGallon: record.valuePerGallon, observations: record.observations });
    setEditingRecordId(record.id);
    setShowAddForm(true);
  };

  const renderResumen = () => (
    <div className="space-y-8 animate-gulf">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Volumen Global', val: globalStats.totalGallons.toLocaleString() + ' Gal', icon: Fuel, color: '#002F6C', trend: 'Plan Activo' },
          { label: 'Saldo Total', val: formatCurrency(globalStats.totalInvestment), icon: DollarSign, color: '#FF6A00', trend: 'Disponible' },
          { label: 'Distribuidores', val: globalStats.totalDistributors, icon: Building2, color: '#002F6C', trend: 'Nacional' },
          { label: 'Fuerza Comercial', val: globalStats.totalCommercials, icon: Users, color: '#FF6A00', trend: 'Participantes' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center" style={{ color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded-full ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'} uppercase`}>{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black italic text-[#002F6C] tracking-tight">{stat.val}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-xs mb-8">Volumen por Distribuidor</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributorStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '10px' }} />
                <Bar dataKey="gallons" fill="#002F6C" radius={[6,6,0,0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-xs mb-8">Distribución de Saldos</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributorStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="balance">
                  {distributorStats.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {distributorStats.slice(0,5).map((dist, idx) => (
              <div key={dist.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="font-black text-slate-500 uppercase truncate max-w-[120px]">{dist.name}</span>
                </div>
                <span className="font-black text-[#FF6A00]">{formatCurrency(dist.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSaldos = () => {
    const filteredSaldos = commercials.filter(c => c.distributor !== 'PRUEBA' && (saldosDistributor === 'Todos' || c.distributor === saldosDistributor)).sort((a,b) => b.balance - a.balance);
    const totalSaldo = filteredSaldos.reduce((s,c) => s + c.balance, 0);

    return (
      <div className="space-y-6 animate-gulf">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border-2 border-slate-100 flex-grow">
            <Filter size={16} className="text-[#002F6C]" />
            <select value={saldosDistributor} onChange={e => setSaldosDistributor(e.target.value)} className="bg-transparent outline-none font-black text-[11px] uppercase text-[#002F6C] cursor-pointer w-full">
              {distributors.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button
            onClick={() => handleDownloadPDF(saldosDistributor)}
            className="flex items-center gap-2 bg-[#002F6C] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#003d8c] transition-all shadow-lg"
          >
            <FileDown size={16} /> Descargar PDF
          </button>
        </div>

        <div className="bg-[#002F6C] rounded-2xl p-6 flex justify-between items-center border-b-4 border-[#FF6A00]">
          <div>
            <h2 className="text-white font-black text-xl uppercase tracking-tighter">Saldos Disponibles</h2>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">{filteredSaldos.length} comerciales · {saldosDistributor === 'Todos' ? 'Todos los distribuidores' : saldosDistributor}</p>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-2xl text-center">
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Total Saldo</p>
            <p className="text-[#FF6A00] font-black text-2xl italic">{formatCurrency(totalSaldo)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribuidor</th>
                  <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Comercial</th>
                  <th className="text-center px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Galones</th>
                  <th className="text-right px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Redimido</th>
                  <th className="text-right px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Disponible</th>
                </tr>
              </thead>
              <tbody>
                {filteredSaldos.map((c, idx) => (
                  <tr key={c.id} className={`border-b border-slate-50 hover:bg-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-6 py-3 text-[11px] font-black text-[#002F6C] uppercase">{c.distributor}</td>
                    <td className="px-6 py-3 text-[11px] font-bold text-slate-700 uppercase">{c.name}</td>
                    <td className="px-6 py-3 text-[11px] font-bold text-slate-500 text-center">{c.gallons.toLocaleString()}</td>
                    <td className="px-6 py-3 text-[11px] font-black text-red-500 italic text-right">{formatCurrency(totalRedimidoByEmail[c.email] || 0)}</td>
                    <td className="px-6 py-3 text-[11px] font-black text-[#FF6A00] italic text-right">{formatCurrency(c.balance)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#002F6C]">
                  <td colSpan={4} className="px-6 py-3 text-[10px] font-black text-white uppercase">Total General</td>
                  <td className="px-6 py-3 text-[11px] font-black text-[#FF6A00] italic text-right">{formatCurrency(totalSaldo)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTopRedenciones = () => {
    const topComerciales = commercials
      .filter(c => c.distributor !== 'PRUEBA')
      .map(c => ({ ...c, totalRedimido: totalRedimidoByEmail[c.email] || 0 }))
      .filter(c => c.totalRedimido > 0)
      .sort((a,b) => b.totalRedimido - a.totalRedimido);

    const topDistribuidores = distributorStats.map(d => ({
      ...d,
      totalRedimido: commercials.filter(c => c.distributor === d.name).reduce((s,c) => s + (totalRedimidoByEmail[c.email] || 0), 0)
    })).filter(d => d.totalRedimido > 0).sort((a,b) => b.totalRedimido - a.totalRedimido);

    const totalGlobalRedimido = topComerciales.reduce((s,c) => s + c.totalRedimido, 0);

    return (
      <div className="space-y-6 animate-gulf">
        <div className="bg-[#002F6C] rounded-2xl p-6 flex justify-between items-center border-b-4 border-[#FF6A00]">
          <div>
            <h2 className="text-white font-black text-xl uppercase tracking-tighter">Top Redenciones</h2>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">{topComerciales.length} comerciales han redimido</p>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-2xl text-center">
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Total Redimido</p>
            <p className="text-[#FF6A00] font-black text-2xl italic">{formatCurrency(totalGlobalRedimido)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Comerciales */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h3 className="font-black text-[#002F6C] uppercase tracking-widest text-xs flex items-center gap-2">
                <Trophy size={14} className="text-[#FF6A00]" /> Top Comerciales
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {topComerciales.slice(0,10).map((c, idx) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-orange-50/30 transition-all">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-[#FF6A00] text-white' : idx === 1 ? 'bg-slate-300 text-white' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    #{idx+1}
                  </div>
                  <div className="flex-grow">
                    <p className="text-[11px] font-black text-[#002F6C] uppercase">{c.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{c.distributor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-[#FF6A00] italic">{formatCurrency(c.totalRedimido)}</p>
                    <div className="w-20 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#FF6A00]" style={{ width: `${(c.totalRedimido / (topComerciales[0]?.totalRedimido || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
              {topComerciales.length === 0 && <p className="text-center text-slate-400 font-bold uppercase text-xs py-10">Aún no hay redenciones</p>}
            </div>
          </div>

          {/* Top Distribuidores */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h3 className="font-black text-[#002F6C] uppercase tracking-widest text-xs flex items-center gap-2">
                <Building2 size={14} className="text-[#FF6A00]" /> Por Distribuidor
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {topDistribuidores.map((d, idx) => (
                <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-orange-50/30 transition-all">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-[#002F6C] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    #{idx+1}
                  </div>
                  <div className="flex-grow">
                    <p className="text-[11px] font-black text-[#002F6C] uppercase truncate max-w-[150px]">{d.name}</p>
                    <p className="text-[9px] font-bold text-slate-400">{d.staff} comerciales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-[#FF6A00] italic">{formatCurrency(d.totalRedimido)}</p>
                    <div className="w-20 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#002F6C]" style={{ width: `${(d.totalRedimido / (topDistribuidores[0]?.totalRedimido || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
              {topDistribuidores.length === 0 && <p className="text-center text-slate-400 font-bold uppercase text-xs py-10">Aún no hay redenciones</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDistribuidores = () => (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-gulf">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-xs">Gestión de Distribuidores</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{distributorStats.length} Aliados Activos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th className="px-8 py-6">Distribuidor</th>
              <th className="px-8 py-6 text-center">Comerciales</th>
              <th className="px-8 py-6 text-center">Galones</th>
              <th className="px-8 py-6 text-right">Saldo Total</th>
              <th className="px-8 py-6 text-right">Total Redimido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {distributorStats.map(dist => (
              <tr key={dist.name} className="hover:bg-blue-50/20 transition-all">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#002F6C] text-white flex items-center justify-center font-black italic text-xs">{dist.name.charAt(0)}</div>
                    <p className="text-xs font-black text-[#002F6C] uppercase tracking-tight">{dist.name}</p>
                  </div>
                </td>
                <td className="px-8 py-5 text-center"><span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600">{dist.staff}</span></td>
                <td className="px-8 py-5 text-center"><p className="text-xs font-black italic">{dist.gallons.toLocaleString()} Gal</p></td>
                <td className="px-8 py-5 text-right"><p className="text-xs font-black text-[#FF6A00] italic">{formatCurrency(dist.balance)}</p></td>
                <td className="px-8 py-5 text-right">
                  <p className="text-xs font-black text-red-500 italic">
                    {formatCurrency(commercials.filter(c => c.distributor === dist.name).reduce((s,c) => s + (totalRedimidoByEmail[c.email] || 0), 0))}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderComerciales = () => (
    <div className="space-y-6 animate-gulf">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="BUSCAR COMERCIAL..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase tracking-widest placeholder:text-slate-300 shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <select value={filterDistributor} onChange={e => setFilterDistributor(e.target.value)} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase tracking-widest shadow-sm appearance-none cursor-pointer">
            {distributors.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-xs">Gestión de Saldos de Comerciales</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredCommercials.length} Comerciales</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Distribuidor</th>
                <th className="px-8 py-6">Comercial</th>
                <th className="px-8 py-6 text-center">Galones</th>
                <th className="px-8 py-6 text-right">Saldo Disponible</th>
                <th className="px-8 py-6 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCommercials.map(comm => (
                <tr key={comm.id} className="hover:bg-blue-50/20 transition-all">
                  <td className="px-8 py-5"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{comm.distributor}</span></td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-black text-[#002F6C] uppercase">{comm.name}</p>
                    <p className="text-[9px] font-bold text-slate-400">{comm.email}</p>
                  </td>
                  <td className="px-8 py-5 text-center"><p className="text-xs font-black italic">{comm.gallons.toLocaleString()}</p></td>
                  <td className="px-8 py-5 text-right"><p className="text-xs font-black text-[#FF6A00] italic">{formatCurrency(comm.balance)}</p></td>
                  <td className="px-8 py-5 text-center">
                    <button onClick={() => { setActiveTab('historial'); setSearchTerm(comm.name); }} className="px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto bg-[#002F6C] text-white shadow-lg hover:scale-105 transition-all">
                      <History size={12} /> Ver Historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHistorial = () => (
    <div className="space-y-6 animate-gulf">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="BUSCAR POR COMERCIAL O DISTRIBUIDOR..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase tracking-widest placeholder:text-slate-300 shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select value={filterDistributor} onChange={e => setFilterDistributor(e.target.value)} className="px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase tracking-widest shadow-sm appearance-none cursor-pointer">
          {distributors.map(d => <option key={d} value={d}>{d === 'Todos' ? 'DISTRIBUIDOR: TODOS' : d.toUpperCase()}</option>)}
        </select>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase tracking-widest shadow-sm appearance-none cursor-pointer">
          <option value="Todos">MES: TODOS</option>
          {months.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
        </select>
        <button onClick={() => { setEditingRecordId(null); setShowAddForm(true); }} className="bg-[#FF6A00] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
          <Plus size={18} /> Cargar Saldo
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-[#FF6A00]/20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-sm">{editingRecordId ? 'Editar Registro' : 'Cargar Nuevo Saldo Mensual'}</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
          </div>
          <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comercial</label>
              <select required value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} disabled={!!editingRecordId} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase">
                <option value="">Seleccionar...</option>
                {commercials.map(c => <option key={c.id} value={c.id}>{c.name} ({c.distributor})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mes</label>
              <select required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase">
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Galones Vendidos</label>
              <input type="number" required min="0" value={formData.gallonsSold} onChange={e => setFormData({...formData, gallonsSold: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor por Galón</label>
              <input type="number" required min="0" value={formData.valuePerGallon} onChange={e => setFormData({...formData, valuePerGallon: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo a Cargar</label>
              <div className="w-full px-6 py-4 rounded-2xl bg-blue-50 border border-blue-100 font-black text-[10px] text-[#002F6C]">{formatCurrency(formData.gallonsSold * formData.valuePerGallon)}</div>
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observaciones</label>
              <textarea value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] h-24" placeholder="NOTAS ADICIONALES..." />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600">Cancelar</button>
              <button type="submit" className="bg-[#002F6C] text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all">{editingRecordId ? 'Actualizar' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-xs">Histórico de Movimientos</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredRecords.length} Registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Fecha</th><th className="px-8 py-6">Comercial</th><th className="px-8 py-6">Mes</th>
                <th className="px-8 py-6 text-center">Galones</th><th className="px-8 py-6 text-center">Valor/Gal</th>
                <th className="px-8 py-6 text-right">Saldo Cargado</th><th className="px-8 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-blue-50/20 transition-all">
                  <td className="px-8 py-5"><p className="text-[10px] font-bold text-slate-400">{new Date(record.date).toLocaleDateString()}</p></td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-black text-[#002F6C] uppercase">{record.userName}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{record.distributor}</p>
                  </td>
                  <td className="px-8 py-5"><span className="bg-blue-50 text-[#002F6C] px-3 py-1 rounded-full text-[9px] font-black uppercase">{record.month}</span></td>
                  <td className="px-8 py-5 text-center"><p className="text-xs font-black italic">{record.gallonsSold.toLocaleString()}</p></td>
                  <td className="px-8 py-5 text-center"><p className="text-xs font-black text-slate-500 italic">{formatCurrency(record.valuePerGallon)}</p></td>
                  <td className="px-8 py-5 text-right"><p className="text-xs font-black text-[#FF6A00] italic">{formatCurrency(record.amountLoaded)}</p></td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEditRecord(record)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"><Edit2 size={14} /></button>
                      <button onClick={() => { if(confirm('¿Eliminar este registro?')) onDeleteMonthlyRecord(record.id); }} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-black uppercase text-xs">No se encontraron registros</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPedidos = () => {
    const filteredOrders = orders.filter(o => {
      const ms = o.commercial.toLowerCase().includes(searchTerm.toLowerCase()) || o.productName.toLowerCase().includes(searchTerm.toLowerCase()) || o.distributor.toLowerCase().includes(searchTerm.toLowerCase());
      const md = filterDistributor === 'Todos' || o.distributor === filterDistributor;
      return ms && md;
    });
    const getStatusColor = (s: OrderStatus) => ({ 'Solicitud recibida': 'bg-blue-100 text-blue-600', 'En validación': 'bg-yellow-100 text-yellow-600', 'Aprobado': 'bg-green-100 text-green-600', 'En despacho': 'bg-orange-100 text-orange-600', 'Entregado': 'bg-slate-100 text-slate-600' }[s] || 'bg-slate-100 text-slate-600');
    return (
      <div className="space-y-6 animate-gulf">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="BUSCAR PEDIDO..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase tracking-widest placeholder:text-slate-300 shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select value={filterDistributor} onChange={e => setFilterDistributor(e.target.value)} className="px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase tracking-widest shadow-sm appearance-none cursor-pointer">
            {distributors.map(d => <option key={d} value={d}>{d === 'Todos' ? 'DISTRIBUIDOR: TODOS' : d.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-xs">Gestión de Pedidos</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredOrders.length} Pedidos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">ID / Fecha</th><th className="px-8 py-6">Comercial</th><th className="px-8 py-6">Producto</th>
                  <th className="px-8 py-6">Entrega</th><th className="px-8 py-6 text-center">Estado</th><th className="px-8 py-6 text-center">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-blue-50/20 transition-all">
                    <td className="px-8 py-5">
                      <p className="text-[10px] font-black text-[#002F6C] uppercase">{order.id}</p>
                      <p className="text-[9px] font-bold text-slate-400">{new Date(order.requestDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black text-[#002F6C] uppercase">{order.commercial}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{order.distributor}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black text-slate-700 uppercase">{order.productName}</p>
                      <p className="text-[9px] font-bold text-[#FF6A00] italic">{formatCurrency(order.discountedBalance)}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[10px] font-black text-slate-600 uppercase">Recibe: {order.recipientName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{order.city} · Tel: {order.phone}</p>
                    </td>
                    <td className="px-8 py-5 text-center"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${getStatusColor(order.status)}`}>{order.status}</span></td>
                    <td className="px-8 py-5 text-center">
                      <select value={order.status} onChange={e => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)} className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[9px] font-black uppercase text-[#002F6C] outline-none cursor-pointer hover:border-[#FF6A00]">
                        {['Solicitud recibida','En validación','Aprobado','En despacho','Entregado'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-black uppercase text-xs">No se encontraron pedidos</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderRanking = () => {
    const rankingData = (selectedDistributor === 'Global' ? commercials : commercials.filter(c => c.distributor === selectedDistributor)).filter(c => c.distributor !== 'PRUEBA');
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-gulf">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-[#FF6A00]" size={20} />
              <h3 className="font-black text-[#002F6C] uppercase tracking-[0.2em] text-xs">Ranking {selectedDistributor === 'Global' ? 'Global' : selectedDistributor}</h3>
            </div>
            <select value={selectedDistributor} onChange={e => setSelectedDistributor(e.target.value)} className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-[10px] font-black uppercase text-[#002F6C] outline-none cursor-pointer">
              <option value="Global">Global</option>
              {distributorStats.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            {rankingData.sort((a,b) => b.gallons - a.gallons).slice(0,10).map((comm, idx) => (
              <div key={comm.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-[#FF6A00]/20 transition-all">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black italic text-xs ${idx === 0 ? 'bg-[#FF6A00] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>#{idx+1}</div>
                <div className="flex-grow">
                  <p className="text-[11px] font-black text-[#002F6C] uppercase">{comm.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{comm.distributor}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-[#002F6C] italic">{comm.gallons.toLocaleString()} Gal</p>
                  <div className="w-20 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-[#002F6C]" style={{ width: `${(comm.gallons / (rankingData[0]?.gallons || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#002F6C] p-8 rounded-[2rem] shadow-2xl flex flex-col">
          <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Líderes por Escudería</h3>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {distributorStats.map(dist => {
              const leader = commercials.filter(c => c.distributor === dist.name).sort((a,b) => b.gallons - a.gallons)[0];
              return (
                <div key={dist.name} className="bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6A00] text-white flex items-center justify-center font-black italic text-sm">{dist.name.charAt(0)}</div>
                  <div className="flex-grow">
                    <p className="text-white text-[11px] font-black uppercase">{leader?.name || 'N/A'}</p>
                    <p className="text-blue-200 text-[9px] font-bold uppercase">{dist.name}</p>
                  </div>
                  <p className="text-[#FF6A00] text-sm font-black italic">{leader?.gallons.toLocaleString()} Gal</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 gulf-blue rounded-3xl flex items-center justify-center rotate-3 shadow-xl">
            <LayoutDashboard className="text-[#FF6A00]" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#002F6C] italic tracking-tighter uppercase leading-none">Administrador Central</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Visibilidad Global de Incentivos GULF</p>
          </div>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto gap-1">
          {[
            { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
            { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
            { id: 'saldos', label: 'Saldos', icon: DollarSign },
            { id: 'topredenciones', label: 'Top Redenciones', icon: Gift },
            { id: 'historial', label: 'Cargar Saldo', icon: Plus },
            { id: 'comerciales', label: 'Comerciales', icon: Users },
            { id: 'distribuidores', label: 'Aliados', icon: Building2 },
            { id: 'ranking', label: 'Ranking', icon: Award },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-[#002F6C] shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
              <tab.icon size={14} className={activeTab === tab.id ? 'text-[#FF6A00]' : ''} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-[600px]">
        {activeTab === 'resumen' && renderResumen()}
        {activeTab === 'pedidos' && renderPedidos()}
        {activeTab === 'saldos' && renderSaldos()}
        {activeTab === 'topredenciones' && renderTopRedenciones()}
        {activeTab === 'historial' && renderHistorial()}
        {activeTab === 'comerciales' && renderComerciales()}
        {activeTab === 'distribuidores' && renderDistribuidores()}
        {activeTab === 'ranking' && renderRanking()}
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:10px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#FF6A00}.animate-gulf{animation:fade-in-up 0.5s ease-out forwards}`}</style>
    </div>
  );
};

export default AdminDashboard;
