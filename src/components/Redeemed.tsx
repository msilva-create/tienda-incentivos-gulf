import React, { useState } from 'react';
import { User, Order, RedeemedItem } from '../types';
import { ShoppingBag, Clock, Truck, Search, Filter } from 'lucide-react';

interface RedeemedProps {
  user: User;
  orders: Order[];
  redeemedItems: RedeemedItem[];
  onBack: () => void;
}

const Redeemed: React.FC<RedeemedProps> = ({ user, orders, redeemedItems, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistributor, setFilterDistributor] = useState('TODOS');

  const isAdmin = user.email === 'admin.gulf' || user.distributor === 'CENTRAL GULF' || user.distributor === 'GULF CENTRAL';

  // Combinar orders y redeemedItems en una sola lista normalizada
  const allItems = React.useMemo(() => {
    const fromOrders = orders.map(o => ({
      id: o.id,
      date: o.requestDate,
      distributor: o.distributor,
      commercial: o.commercial || '',
      productName: o.productName,
      price: o.discountedBalance,
      userEmail: o.userEmail,
      city: o.city || '—',
      status: o.status,
      source: 'order' as const,
    }));

    const fromRedeemed = redeemedItems
      .filter(r => !orders.find(o => o.id === r.id)) // evitar duplicados
      .map(r => ({
        id: r.id,
        date: r.date,
        distributor: r.distributor,
        commercial: '',
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
    if (searchTerm) {
      result = result.filter(o =>
        o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.commercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDistributor !== 'TODOS') {
      result = result.filter(o => o.distributor === filterDistributor);
    }
    return result;
  }, [allItems, user, isAdmin, searchTerm, filterDistributor]);

  const distributors = React.useMemo(() => {
    const all = [...new Set(allItems.map(o => o.distributor))].filter(Boolean);
    return ['TODOS', ...all.sort()];
  }, [allItems]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(val);

  const totalRedimido = visibleItems.reduce((sum, o) => sum + o.price, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solicitud recibida': return 'bg-blue-100 text-blue-600';
      case 'En validación': return 'bg-yellow-100 text-yellow-600';
      case 'Aprobado': return 'bg-green-100 text-green-600';
      case 'En despacho': return 'bg-orange-100 text-orange-600';
      case 'Historial': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-100 text-slate-600';
    }
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
          <h2 className="text-3xl font-black text-slate-700 mb-3">
            {isAdmin ? 'No hay redenciones registradas.' : 'Aún no has redimido ningún producto.'}
          </h2>
          <p className="text-slate-500 font-bold mb-8">
            {isAdmin ? 'Las redenciones aparecerán aquí cuando los usuarios rediman.' : 'Explora nuestro catálogo y empieza a ganar.'}
          </p>
          {!isAdmin && (
            <button onClick={onBack} className="bg-[#FF6A00] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-[#E66000] transition-colors">
              Ir al Catálogo
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">

          {/* Header con total */}
          <div className="bg-[#002F6C] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b-4 border-[#FF6A00]">
            <div>
              <h2 className="text-white font-black text-2xl uppercase tracking-tighter">
                {isAdmin ? 'HISTORIAL GLOBAL DE REDENCIONES' : 'MIS REDENCIONES'}
              </h2>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">
                {visibleItems.length} redención{visibleItems.length !== 1 ? 'es' : ''} registrada{visibleItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl text-center">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Total Redimido</p>
              <p className="text-[#FF6A00] font-black text-2xl italic">{formatCurrency(totalRedimido)}</p>
            </div>
          </div>

          {/* Filtros — solo admin */}
          {isAdmin && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por producto, comercial o distribuidor..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FF6A00] outline-none font-bold text-sm uppercase tracking-wide"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border-2 border-slate-100">
                <Filter size={16} className="text-[#002F6C]" />
                <select
                  value={filterDistributor}
                  onChange={e => setFilterDistributor(e.target.value)}
                  className="bg-transparent outline-none font-black text-[11px] uppercase text-[#002F6C] cursor-pointer"
                >
                  {distributors.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
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
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-500">
                          {new Date(item.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-black text-[#002F6C] uppercase">{item.distributor}</td>
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase">{item.commercial || '—'}</td>
                        <td className="px-4 py-3 text-[11px] font-black text-slate-700 uppercase max-w-[200px]">{item.productName}</td>
                        <td className="px-4 py-3 text-[11px] font-black text-[#FF6A00] italic whitespace-nowrap">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">{item.city}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Vista usuario — tarjetas */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ID: {item.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#002F6C] mb-2 uppercase tracking-tighter">{item.productName}</h3>
                    <p className="text-lg font-bold text-[#FF6A00] mb-4 italic">{formatCurrency(item.price)}</p>
                    <div className="space-y-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          {new Date(item.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
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
