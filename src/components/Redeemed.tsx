import React from 'react';
import { User, RedeemedItem, Order } from '../types';
import { ShoppingBag, Clock, CheckCircle2, Truck, Package, Search } from 'lucide-react';

interface RedeemedProps {
  user: User;
  orders: Order[];
  onBack: () => void;
}

const Redeemed: React.FC<RedeemedProps> = ({ user, orders, onBack }) => {
  const userOrders = React.useMemo(() => {
    return orders.filter(o => o.userEmail === user.email);
  }, [orders, user.email]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="text-slate-500 hover:text-[#002F6C] flex items-center gap-2 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
        <span className="font-bold uppercase text-sm">Volver a Tienda</span>
      </button>

      {userOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-2xl shadow-lg">
          <ShoppingBag size={64} className="text-slate-300 mb-6" />
          <h2 className="text-3xl font-black text-slate-700 mb-3">Aún no has redimido ningún producto.</h2>
          <p className="text-slate-500 font-bold mb-8">Explora nuestro catálogo y empieza a ganar.</p>
          <button
            onClick={onBack}
            className="bg-[#FF6A00] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-[#E66000] transition-colors"
          >
            Ir al Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden gulf-card">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ID: {order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    order.status === 'Solicitud recibida' ? 'bg-blue-100 text-blue-600' :
                    order.status === 'En validación' ? 'bg-yellow-100 text-yellow-600' :
                    order.status === 'Aprobado' ? 'bg-green-100 text-green-600' :
                    order.status === 'En despacho' ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#002F6C] mb-2 uppercase tracking-tighter">{order.productName}</h3>
                <p className="text-lg font-bold text-[#FF6A00] mb-4 italic">{formatCurrency(order.discountedBalance)}</p>
                
                <div className="space-y-2 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={12} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Solicitado el: {new Date(order.requestDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Truck size={12} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Entrega en: {order.city}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Redeemed;
