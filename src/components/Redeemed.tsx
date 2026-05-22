import React, { useState } from 'react';
import { User, Order, RedeemedItem } from '../types';
import { RAW_USERS } from '../users';
import { ShoppingBag, Clock, Truck, Search, Filter, FileDown } from 'lucide-react';

interface RedeemedProps {
  user: User;
  orders: Order[];
  redeemedItems: RedeemedItem[];
  onBack: () => void;
}

const Redeemed: React.FC<RedeemedProps> = ({ user, orders, redeemedItems, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistributor, setFilterDistributor] = useState('TODOS');
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const isAdmin = user.email === 'admin.gulf' || user.distributor === 'CENTRAL GULF' || user.distributor === 'GULF CENTRAL';

  // Mapa de email → nombre comercial
  const emailToName: Record<string, string> = {};
  RAW_USERS.forEach(u => { emailToName[u.email] = u.name; });

  const allItems = React.useMemo(() => {
    const fromOrders = orders.map(o => ({
      id: o.id,
      date: o.requestDate,
      distributor: o.distributor,
      commercial: o.commercial || emailToName[o.userEmail] || o.userEmail,
      productName: o.productName,
      price: o.discountedBalance,
      userEmail: o.userEmail,
      city: o.city || '—',
      status: o.status,
      source: 'order' as const,
    }));

    const fromRedeemed = redeemedItems
      .filter(r => !orders.find(o => o.id === r.id))
      .map(r => ({
        id: r.id,
        date: r.date,
        distributor: r.distributor,
        commercial: emailToName[r.userEmail] || r.userEmail,
        productName: r.productName,
        price: r.price,
        userEmail: r.userEmail,
        city: '—',
        status: 'Historial',
        source: 'redeemed' as const,
      }));

    return [...fromOrders, ...fromRedeemed].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [orders, redeemedItems]);

  const visibleItems = React.useMemo(() => {
    let result = isAdmin ? allItems : allItems.filter(o => o.userEmail === user.email);
    if (searchTerm) result = result.filter(o =>
      o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.commercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterDistributor !== 'TODOS') result = result.filter(o => o.distributor === filterDistributor);
    return result;
  }, [allItems, user, isAdmin, searchTerm, filterDistributor]);

  const distributors = React.useMemo(() => {
    const all = [...new Set(allItems.map(o => o.distributor))].filter(Boolean).sort();
    return ['TODOS', ...all];
  }, [allItems]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  const totalRedimido = visibleItems.reduce((sum, o) => sum + o.price, 0);

  const getStatus = (item: typeof visibleItems[0]) => localStatuses[item.id] || item.status;

  const STATUS_OPTIONS = ['Historial', 'Solicitud recibida', 'En validación', 'Aprobado', 'En despacho', 'Entregado'];

  const getStatusColor = (status: string) => ({
    'Solicitud recibida': 'bg-blue-100 text-blue-600',
    'En validación': 'bg-yellow-100 text-yellow-600',
    'Aprobado': 'bg-green-100 text-green-600',
    'En despacho': 'bg-orange-100 text-orange-600',
    'Entregado': 'bg-green-200 text-green-700',
    'Historial': 'bg-slate-100 text-slate-500',
  }[status] || 'bg-slate-100 text-slate-600');

  const handleDownloadPDF = () => {
    const date = new Date().toLocaleDateString('es-CO');
    const rows = visibleItems.map(item => `
      <tr>
        <td>${new Date(item.date).toLocaleDateString('es-CO')}</td>
        <td>${item.distributor}</td>
        <td>${item.commercial}</td>
        <td>${item.productName}</td>
        <td style="text-align:right;color:#FF6A00;font-weight:bold">${formatCurrency(item.price)}</td>
        <td>${item.city}</td>
        <td><span style="padding:3px 8px;border-radius:20px;font-size:9px;background:#f1f5f9">${getStatus(item)}</span></td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Historial de Redenciones Gulf</title>
      <style>
        body{font-family:Arial,sans-serif;padding:30px;color:#1e293b}
        .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;border-bottom:4px solid #FF6A00;padding-bottom:20px}
        h1{color:#002F6C;font-size:20px;margin:0;text-transform:uppercase}
        .subtitle{color:#64748b;font-size:11px;margin-top:4px;text-transform:uppercase;letter-spacing:2px}
        table{width:100%;border-collapse:collapse;margin-top:20px;font-size:11px}
        th{background:#002F6C;color:white;padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px}
        td{padding:9px 12px;border-bottom:1px solid #f1f5f9}
        tr:nth-child(even) td{background:#f8fafc}
        .total-row td{background:#002F6C;color:white;font-weight:bold;padding:12px}
        .footer{margin-top:30px;text-align:center;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:2px}
      </style></head><body>
      <div class="header">
        <div>
          <h1>Historial de Redenciones Gulf</h1>
          <div class="subtitle">Programa "Vender GULF sí paga" · ${filterDistributor === 'TODOS' ? 'Todos los distribuidores' : filterDistributor}</div>
        </div>
        <div style="color:#64748b;font-size:11px">Generado: ${date}</div>
      </div>
      <table>
        <thead><tr><th>Fecha</th><th>Distribuidor</th><th>Comercial</th><th>Producto</th><th style="text-align:right">Valor</th><th>Ciudad</th><th>Estado</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr class="total-row"><td colspan="4">TOTAL GENERAL (${visibleItems.length} redenciones)</td><td style="text-align:right">${formatCurrency(totalRedimido)}</td><td colspan="2"></td></tr></tfoot>
      </table>
      <div class="footer">GULF Lubricantes © ${new Date().getFullYear()} · Confidencial</div>
      </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) win.onload = () => win.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={onBack} className="text-slate-500 hover:text-[#002F6C] flex items-center gap-2 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <span className="font-bold uppercase text-sm">Volver a Tienda</span>
      </button>

      {visibleItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-2xl shadow-lg">
          <ShoppingBag size={64} className="text-slate-300 mb-6" />
          <h2 className="text-3xl font-black text-slate-700 mb-3">{isAdmin ? 'No hay redenciones registradas.' : 'Aún no has redimido ningún producto.'}</h2>
          <p className="text-slate-500 font-bold mb-8">{isAdmin ? 'Las redenciones aparecerán aquí cuando los usuarios rediman.' : 'Explora nuestro catálogo y empieza a ganar.'}</p>
          {!isAdmin && <button onClick={onBack} className="bg-[#FF6A00] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-[#E66000] transition-colors">Ir al Catálogo</button>}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-[#002F6C] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b-4 border-[#FF6A00]">
            <div>
              <h2 className="text-white font-black text-2xl uppercase tracking-tighter">{isAdmin ? 'HISTORIAL GLOBAL DE REDENCIONES' : 'MIS REDENCIONES'}</h2>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">{visibleItems.length} redención{visibleItems.length !== 1 ? 'es' : ''} registrada{visibleItems.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl text-center">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Total Redimido</p>
              <p className="text-[#FF6A00] font-black text-2xl italic">{formatCurrency(totalRedimido)}</p>
            </div>
          </div>

          {/* Filtros admin */}
          {isAdmin && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Buscar por producto, comercial o distribuidor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FF6A00] outline-none font-bold text-sm uppercase tracking-wide" />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border-2 border-slate-100">
                <Filter size={16} className="text-[#002F6C]" />
                <select value={filterDistributor} onChange={e => setFilterDistributor(e.target.value)} className="bg-transparent outline-none font-black text-[11px] uppercase text-[#002F6C] cursor-pointer">
                  {distributors.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#002F6C] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#003d8c] transition-all shadow-lg">
                <FileDown size={16} /> Descargar PDF
              </button>
            </div>
          )}

          {/* Vista admin — tabla */}
          {isAdmin ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribuidor</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Comercial</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ciudad</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item, idx) => (
                      <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-500">{new Date(item.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="px-4 py-3 text-[11px] font-black text-[#002F6C] uppercase">{item.distributor}</td>
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase">{item.commercial}</td>
                        <td className="px-4 py-3 text-[11px] font-black text-slate-700 uppercase max-w-[180px]">{item.productName}</td>
                        <td className="px-4 py-3 text-[11px] font-black text-[#FF6A00] italic whitespace-nowrap">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">{item.city}</td>
                        <td className="px-4 py-3">
                          <select
                            value={getStatus(item)}
                            onChange={e => setLocalStatuses(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border-0 outline-none cursor-pointer ${getStatusColor(getStatus(item))}`}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ID: {item.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusColor(getStatus(item))}`}>{getStatus(item)}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#002F6C] mb-2 uppercase tracking-tighter">{item.productName}</h3>
                    <p className="text-lg font-bold text-[#FF6A00] mb-4 italic">{formatCurrency(item.price)}</p>
                    <div className="space-y-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <p className="text-[10px] font-bold uppercase tracking-widest">{new Date(item.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      {item.city !== '—' && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Truck size={12} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Entrega en: {item.city}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Redeemed;
