
import React, { useState, useMemo } from 'react';
import { User, Product } from '../types';
import { CATALOG_PRODUCTS } from '../constants';
import { ShoppingBag, Search, ChevronLeft, CheckCircle2, AlertCircle, Sparkles, ArrowUpDown, Gift, Heart, Wallet, X } from 'lucide-react';

interface CatalogProps {
  user: User;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onRedeem: (product: Product) => void;
  onCreateOrder: (order: any) => void;
  onBack?: () => void;
}

const Catalog: React.FC<CatalogProps> = ({ user, wishlist, onToggleWishlist, onRedeem, onCreateOrder, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [confirmingProduct, setConfirmingProduct] = useState<Product | null>(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [deliveryData, setDeliveryData] = useState({
    recipientName: '',
    contactName: '',
    phone: '',
    email: user.email,
    city: '',
    address: '',
    reference: '',
    observations: ''
  });

  const isCentralGulf = user.distributor === 'CENTRAL GULF';
  const isTestUser = user.distributor === 'PRUEBA';

  const categories = useMemo(() => {
    const rawCats = Array.from(new Set(CATALOG_PRODUCTS.map(p => p.category)));
    const cats = rawCats.filter(c => c !== 'MOVILIDAD ELÉCTRICA');
    const techIdx = Math.max(
      cats.indexOf('TECNOLOGÍA Y ENTRETENIMIENTO'),
      cats.indexOf('TECNOLOGÍA Y HOGAR INTELIGENTE')
    );
    
    if (techIdx !== -1) {
      cats.splice(techIdx + 1, 0, 'MOVILIDAD ELÉCTRICA');
    } else {
      cats.push('MOVILIDAD ELÉCTRICA');
    }
    return ['TODOS', ...cats];
  }, []);

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'TODOS' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
  }, [searchTerm, selectedCategory, sortOrder]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getProductBadge = (product: Product) => {
    if (product.label) {
      if (product.label.includes('MÁS PEDIDO')) return { label: product.label, icon: '⭐', color: 'bg-[#FF6A00]' };
      if (product.label.includes('MÁS TOP')) return { label: product.label, icon: '🔥', color: 'bg-red-500' };
      if (product.label.includes('HOGAR INTELIGENTE')) return { label: product.label, icon: '💡', color: 'bg-blue-500' };
      return { label: product.label, icon: '✨', color: 'bg-[#FF6A00]' };
    }
    if (product.category === 'MOVILIDAD ELÉCTRICA') return { label: '🏆 PREMIUM', icon: '🏆', color: 'bg-yellow-500' };
    if (product.name === 'Aspiradora Robot') return { label: '⭐ MÁS PEDIDO', icon: '⭐', color: 'bg-[#FF6A00]' };
    if (product.price > 3000000) return { label: '🏆 PREMIUM', icon: '🏆', color: 'bg-yellow-500' };
    if (product.price > 2000000) return { label: '🎯 META ALTA', icon: '🎯', color: 'bg-[#FF6A00]' };
    if (product.category === 'BONOS ÉXITO + PRODUCTO') return { label: 'BONO + PRODUCTO', icon: '🎁', color: 'bg-[#002F6C]' };
    if (product.price < 300000) return { label: '💰 REDENCIÓN RÁPIDA', icon: '💰', color: 'bg-green-500' };
    if (product.id.includes('e3') || product.id.includes('te1') || product.id.includes('c1')) return { label: '⭐ MÁS PEDIDO', icon: '⭐', color: 'bg-[#FF6A00]' };
    return null;
  };

  const handleRedeemClick = (product: Product) => {
    if (user.balance < product.price && user.distributor !== 'CENTRAL GULF') {
      alert('Saldo insuficiente para redimir este producto.');
      return;
    }
    setConfirmingProduct(product);
  };

  const handleNextToDelivery = () => {
    setShowDeliveryForm(true);
  };

  const confirmRedemption = () => {
    if (confirmingProduct) {
      // Validate form
      if (!deliveryData.recipientName || !deliveryData.contactName || !deliveryData.phone || !deliveryData.city || !deliveryData.address) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
      }

      const orderId = `ORD-${Date.now()}`;
      const requestDate = new Date().toISOString();
      
      const newOrder = {
        id: orderId,
        ...deliveryData,
        requestDate,
        distributor: user.distributor,
        commercial: user.name + (isTestUser ? ' (PRUEBA)' : ''),
        productName: confirmingProduct.name + (isTestUser ? ' (PRUEBA)' : ''),
        productId: confirmingProduct.id,
        userEmail: user.email,
        quantity: 1,
        balanceBefore: user.balance,
        discountedBalance: confirmingProduct.price,
        finalBalance: user.balance - confirmingProduct.price,
        status: 'Solicitud recibida'
      };

      onCreateOrder(newOrder);
      setOrderSuccess(true);
      
      setTimeout(() => {
        setOrderSuccess(false);
        setConfirmingProduct(null);
        setShowDeliveryForm(false);
        setDeliveryData({
          recipientName: '',
          contactName: '',
          phone: '',
          email: user.email,
          city: '',
          address: '',
          reference: '',
          observations: ''
        });
      }, 3000);
    }
  };

  const isCommercial = user.role === 'COMMERCIAL';
  const isBonoCategory = selectedCategory === 'BONOS ÉXITO + PRODUCTO';

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-gulf">
      {isTestUser && (
        <div className="bg-red-600 text-white py-3 px-6 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-red-100 border-2 border-red-400 animate-pulse">
          ⚠️ ESTÁS EN MODO PRUEBA - ESTA REDENCIÓN NO AFECTARÁ SALDOS REALES ⚠️
        </div>
      )}
      {/* Modal Confirmación */}
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
                    Tu solicitud de redención ha sido enviada al Administrador Central para su aprobación.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#002F6C] italic uppercase">
                      {showDeliveryForm ? 'Datos de Entrega' : 'Confirmar Redención'}
                    </h3>
                    <button onClick={() => { setConfirmingProduct(null); setShowDeliveryForm(false); }} className="text-slate-300 hover:text-slate-500 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  {!showDeliveryForm ? (
                    <>
                      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 mb-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Producto Seleccionado</p>
                        <h4 className="text-[#002F6C] font-black uppercase text-lg leading-tight mb-2">{confirmingProduct.name}</h4>
                        <p className="text-[#FF6A00] font-black text-xl italic">{formatCurrency(confirmingProduct.price)}</p>
                      </div>

                      <p className="text-slate-500 text-xs font-bold uppercase mb-8 leading-relaxed">
                        Al confirmar, se generará una solicitud interna que será validada por el equipo administrativo de GULF.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setConfirmingProduct(null)}
                          className="py-4 rounded-2xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleNextToDelivery}
                          className="py-4 rounded-2xl btn-gulf shadow-lg shadow-orange-100"
                        >
                          Siguiente
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 text-left max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre de quien recibe *</label>
                        <input 
                          type="text" 
                          value={deliveryData.recipientName}
                          onChange={(e) => setDeliveryData({...deliveryData, recipientName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase"
                          placeholder="NOMBRE COMPLETO"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre de contacto *</label>
                        <input 
                          type="text" 
                          value={deliveryData.contactName}
                          onChange={(e) => setDeliveryData({...deliveryData, contactName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase"
                          placeholder="QUIEN COORDINA"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Celular *</label>
                          <input 
                            type="tel" 
                            value={deliveryData.phone}
                            onChange={(e) => setDeliveryData({...deliveryData, phone: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px]"
                            placeholder="300 000 0000"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ciudad *</label>
                          <input 
                            type="text" 
                            value={deliveryData.city}
                            onChange={(e) => setDeliveryData({...deliveryData, city: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase"
                            placeholder="CIUDAD"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dirección *</label>
                        <input 
                          type="text" 
                          value={deliveryData.address}
                          onChange={(e) => setDeliveryData({...deliveryData, address: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase"
                          placeholder="DIRECCIÓN DE ENTREGA"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Barrio o Referencia</label>
                        <input 
                          type="text" 
                          value={deliveryData.reference}
                          onChange={(e) => setDeliveryData({...deliveryData, reference: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] uppercase"
                          placeholder="BARRIO / EDIFICIO / APTO"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Observaciones</label>
                        <textarea 
                          value={deliveryData.observations}
                          onChange={(e) => setDeliveryData({...deliveryData, observations: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-[#FF6A00] outline-none font-black text-[10px] h-20 uppercase"
                          placeholder="COMENTARIOS ADICIONALES"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                          onClick={() => setShowDeliveryForm(false)}
                          className="py-4 rounded-2xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Atrás
                        </button>
                        <button 
                          onClick={confirmRedemption}
                          className="py-4 rounded-2xl btn-gulf shadow-lg shadow-orange-100"
                        >
                          Finalizar
                        </button>
                      </div>
                    </div>
                  ) }
                </>
              )}
            </div>
            <div className="h-2 racing-stripe-header"></div>
          </div>
        </div>
      )}

      {/* Catalog Header */}
      <div className="bg-[#002F6C] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-b-[6px] border-[#FF6A00]">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShoppingBag size={200} className="text-white" />
        </div>
        
        <div className="relative z-10">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-4 group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
            </button>
          )}
          <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter leading-none mb-2">
            {isCommercial ? 'MI TIENDA GULF' : 'CATÁLOGO DE PREMIOS'}
          </h2>
          <p className="text-blue-200 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-1 bg-[#FF6A00] rounded-full"></span> Selecciona el premio que deseas redimir hoy
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col gap-2 min-w-[240px]">
           {!isCentralGulf ? (
             <div className="text-center">
               <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Saldo Disponible</p>
               <p className="text-3xl font-black text-white italic">{formatCurrency(user.balance)}</p>
             </div>
           ) : (
             <div className="text-center">
               <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Estatus</p>
               <p className="text-2xl font-black text-white italic">COMPRA LIBRE</p>
             </div>
           )}
           {isCommercial && (
             <div className="pt-2 border-t border-white/10 text-center">
               <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Galones vendidos</p>
               <p className="text-xl font-black text-[#FF6A00] italic">{user.gallons.toLocaleString()} gal</p>
             </div>
           )}
        </div>
      </div>

      {/* Special Category Description */}
      {isBonoCategory && (
        <div className="bg-blue-50/50 border-2 border-blue-100 p-6 rounded-3xl animate-gulf">
          <p className="text-[#002F6C] font-bold text-base uppercase leading-tight italic">
            “Canjea tu Bono Éxito y recibe un producto adicional. <br/>
            <span className="text-[#FF6A00]">Genera tu solicitud de redención ahora.</span>”
          </p>
        </div>
      )}

      {/* Motivational Toast for Commercial */}
      {isCommercial && !isBonoCategory && (
        <div className="bg-orange-50 border-2 border-[#FF6A00]/20 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-[#FF6A00] p-2 rounded-xl text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-[#002F6C] font-black text-xs uppercase tracking-tight">¡Excelente trabajo!</p>
            <p className="text-[#002F6C]/70 text-[10px] font-bold uppercase">Sigue vendiendo GULF para redimir los premios de tus sueños.</p>
          </div>
        </div>
      )}

      {/* Filters & Sorting */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="BUSCAR PRODUCTO..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#FF6A00] outline-none font-black text-sm uppercase tracking-widest placeholder:text-slate-300 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border-2 border-slate-100 shadow-sm w-full lg:w-auto">
            <ArrowUpDown size={18} className="text-[#002F6C]" />
            <span className="text-[10px] font-black text-[#002F6C] uppercase tracking-widest whitespace-nowrap">Ordenar por:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="bg-transparent outline-none font-black text-[10px] uppercase text-[#FF6A00] cursor-pointer"
            >
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto w-full pb-2 custom-scrollbar no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                  selectedCategory === cat 
                    ? 'bg-[#002F6C] border-[#002F6C] text-white shadow-lg' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <h3 className="font-black text-[#002F6C] text-sm uppercase tracking-[0.1em]">
              {selectedCategory}
            </h3>
            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {filteredProducts.length} {isBonoCategory ? 'opciones disponibles' : 'productos'}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const badge = getProductBadge(product);
            const isBonoItem = product.category === 'BONOS ÉXITO + PRODUCTO';
            const isSaved = wishlist.includes(product.id);
            
            return (
              <div key={product.id} className="gulf-card bg-white rounded-[2rem] p-6 flex flex-col h-full shadow-sm relative overflow-hidden group">
                {badge && (
                  <div className={`absolute top-0 left-0 px-4 py-2 text-white text-[9px] font-black uppercase tracking-widest rounded-br-2xl z-10 shadow-md ${badge.color}`}>
                    {badge.label}
                  </div>
                )}
                
                <div className="absolute top-0 right-0 px-4 py-2 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-bl-2xl">
                  {product.category}
                </div>
                
                {/* Imagen del Producto */}
                {product.image && (
                  <div className="w-full h-[200px] flex items-center justify-center overflow-hidden mb-4 bg-white rounded-2xl pt-8 relative">
                    <div className="absolute top-2 left-2 bg-[#0B2D5C]/80 backdrop-blur-sm text-white text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-sm z-10">
                      Imagen de referencia
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
                
                <div className={`${product.image ? 'mb-4' : 'mb-6 pt-10'} flex-grow`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-[#002F6C] font-black uppercase leading-tight tracking-tighter flex-grow ${isBonoItem ? 'text-sm' : 'text-lg'}`}>
                      {product.name}
                    </h4>
                    <button 
                      onClick={() => onToggleWishlist(product.id)}
                      className={`ml-2 p-2 rounded-full transition-all flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${isSaved ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300 hover:text-red-400'}`}
                    >
                      <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
                      {isSaved ? "Guardado" : "Guardar"}
                    </button>
                  </div>
                  {isBonoItem && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Valor:</p>
                  )}
                  <p className="text-[#FF6A00] font-black text-xl italic">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleRedeemClick(product)}
                    className="w-full py-4 rounded-xl btn-gulf shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} /> Redimir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-100">
           <Search size={48} className="text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-black uppercase tracking-widest">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
