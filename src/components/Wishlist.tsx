
import React, { useState } from 'react';
import { User, Product } from '../types';
import { CATALOG_PRODUCTS } from '../constants';
import { Heart, ChevronLeft, CheckCircle2, AlertCircle, Wallet, Fuel, X } from 'lucide-react';

interface WishlistProps {
  user: User;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onBack: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ user, wishlist, onToggleWishlist, onBack }) => {
  const [confirmingProduct, setConfirmingProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const savedProducts = CATALOG_PRODUCTS.filter(p => wishlist.includes(p.id));
  const isCentralGulf = user.distributor === 'CENTRAL GULF';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const confirmRedemption = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setConfirmingProduct(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-gulf">
      {/* Modal Confirmación (Igual al de Catálogo para consistencia) */}
      {confirmingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 text-center">
              {orderSuccess ? (
                <div className="space-y-4 animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-[#002F6C] italic uppercase">¡Solicitud Generada!</h3>
                  <p className="text-slate-500 font-bold text-sm uppercase px-4 leading-relaxed">
                    Tu solicitud de redención ha sido enviada al Administrador Central.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#002F6C] italic uppercase">Confirmar Redención</h3>
                    <button onClick={() => setConfirmingProduct(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Producto Seleccionado</p>
                    <h4 className="text-[#002F6C] font-black uppercase text-lg leading-tight mb-2">{confirmingProduct.name}</h4>
                    <p className="text-[#FF6A00] font-black text-xl italic">{formatCurrency(confirmingProduct.price)}</p>
                  </div>

                  <p className="text-slate-500 text-xs font-bold uppercase mb-8 leading-relaxed">
                    Esta acción generará una solicitud de aprobación para el equipo administrativo de GULF.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setConfirmingProduct(null)} className="py-4 rounded-2xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
                    <button onClick={confirmRedemption} className="py-4 rounded-2xl btn-gulf shadow-lg shadow-orange-100">Confirmar</button>
                  </div>
                </>
              )}
            </div>
            <div className="h-2 racing-stripe-header"></div>
          </div>
        </div>
      )}

      <div className="bg-[#FF6A00] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Heart size={200} className="text-white" fill="white" />
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver a la Tienda
          </button>
          <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter leading-none mb-2">
            MIS PRODUCTOS GUARDADOS
          </h2>
          <p className="text-orange-100 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-1 bg-white rounded-full"></span> Tu lista de metas personales
          </p>
        </div>

        {!isCentralGulf && (
          <div className="relative z-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col gap-2 min-w-[200px] text-center">
              <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1">Tu Saldo</p>
              <p className="text-3xl font-black text-white italic">{formatCurrency(user.balance)}</p>
          </div>
        )}
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map(product => {
            const progress = Math.min((user.balance / product.price) * 100, 100);

            return (
              <div key={product.id} className="bg-white rounded-[2rem] p-6 shadow-sm border-2 border-slate-100 relative group overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{product.category}</span>
                  <button 
                    onClick={() => onToggleWishlist(product.id)}
                    className="p-2 text-red-500 bg-red-50 rounded-full"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-[#002F6C] font-black text-xl uppercase tracking-tighter leading-tight mb-2">{product.name}</h4>
                  <p className="text-[#FF6A00] font-black text-2xl italic">{formatCurrency(product.price)}</p>
                </div>

                <div className="space-y-4">
                  {!isCentralGulf && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between mb-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso de Meta</span>
                         <span className="text-xs font-black text-[#002F6C] italic">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#002F6C] to-[#FF6A00] transition-all duration-700" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setConfirmingProduct(product)}
                    className="w-full py-4 rounded-xl btn-gulf shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} /> Redimir Ahora
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200 flex flex-col items-center max-w-2xl mx-auto mt-10">
           <Heart size={64} className="text-slate-100 mb-6" />
           <h3 className="text-[#002F6C] font-black text-2xl uppercase tracking-tighter mb-2 italic">TU LISTA ESTÁ VACÍA</h3>
           <p className="text-slate-400 font-bold text-sm uppercase mb-8">Aún no has guardado productos. Explora la tienda y guarda tus premios favoritos para ver tu progreso.</p>
           <button 
            onClick={onBack}
            className="btn-gulf px-10 py-4 rounded-2xl shadow-lg shadow-orange-100"
           >
             EXPLORAR TIENDA
           </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
