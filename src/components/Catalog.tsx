import React, { useState, useMemo } from 'react';
import { User, Product } from '../types';
import { CATALOG_PRODUCTS } from '../constants';
import { ShoppingBag, Search, ChevronLeft, CheckCircle2, Heart, X, Sparkles, ArrowUpDown } from 'lucide-react';

interface CatalogProps {
  user: User;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onRedeem: (product: Product, details: any) => void;
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
    return ['TODOS', ...cats, 'MOVILIDAD ELÉCTRICA'];
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

  const confirmRedemption = () => {
    if (confirmingProduct) {
      if (!deliveryData.recipientName || !deliveryData.contactName || !deliveryData.phone || !deliveryData.city || !deliveryData.address) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
      }

      // 1. Datos para EmailJS
      const shippingDetails = {
        receiverName: deliveryData.recipientName,
        contactName: deliveryData.contactName,
        phone: deliveryData.phone,
        city: deliveryData.city,
        address: deliveryData.address,
        reference: deliveryData.reference || 'N/A'
      };

      // 2. Llamada a la función de App.tsx (EmailJS)
      onRedeem(confirmingProduct, shippingDetails);

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {isTestUser && (
        <div className="bg-red-600 text-white py-3 px-6 rounded-2xl text-center font-bold uppercase text-xs animate-pulse">
          ⚠️ MODO PRUEBA ACTIVO ⚠️
        </div>
      )}

      {confirmingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              {orderSuccess ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-[#002F6C] uppercase italic">¡Pedido Enviado!</h3>
                  <p className="text-slate-500 text-sm font-bold">REVISA TU CORREO PARA VER LA CONFIRMACIÓN CON EL LOGO GULF.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#002F6C] italic uppercase">
                      {showDeliveryForm ? 'Datos de Entrega' : 'Confirmar'}
                    </h3>
                    <button onClick={() => setConfirmingProduct(null)}><X size={24} /></button>
                  </div>
                  
                  {!showDeliveryForm ? (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-lg font-bold text-[#002F6C]">{confirmingProduct.name}</p>
                        <p className="text-[#FF6A00] font-black">{formatCurrency(confirmingProduct.price)}</p>
                      </div>
                      <button onClick={() => setShowDeliveryForm(true)} className="w-full py-4 rounded-2xl bg-[#FF6A00] text-white font-bold uppercase">Siguiente</button>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <input className="w-full p-3 border rounded-xl" placeholder="QUIEN RECIBE" value={deliveryData.recipientName} onChange={(e)=>setDeliveryData({...deliveryData, recipientName: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="CONTACTO" value={deliveryData.contactName} onChange={(e)=>setDeliveryData({...deliveryData, contactName: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="CELULAR" value={deliveryData.phone} onChange={(e)=>setDeliveryData({...deliveryData, phone: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="CIUDAD" value={deliveryData.city} onChange={(e)=>setDeliveryData({...deliveryData, city: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="DIRECCIÓN" value={deliveryData.address} onChange={(e)=>setDeliveryData({...deliveryData, address: e.target.value})} />
                      <button onClick={confirmRedemption} className="w-full py-4 rounded-2xl bg-[#002F6C] text-white font-bold uppercase">Finalizar Pedido</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#002F6C] rounded-[2rem] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 border-b-8 border-[#FF6A00]">
        <div>
          <h2 className="text-4xl font-black italic">CATÁLOGO GULF</h2>
          <p className="text-orange-400 font-bold uppercase tracking-widest">Premios exclusivos para ti</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl text-center min-w-[200px]">
          <p className="text-xs uppercase">Tu Saldo</p>
          <p className="text-2xl font-black">{formatCurrency(user.balance)}</p>
        </div>
      </div>

      {/* Grid de Productos Simplificado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-[2rem] p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="h-40 flex items-center justify-center mb-4">
                <img src={product.image} alt={product.name} className="max-h-full object-contain" />
              </div>
              <h4 className="font-bold text-[#002F6C] uppercase text-sm mb-2">{product.name}</h4>
              <p className="text-[#FF6A00] font-black italic">{formatCurrency(product.price)}</p>
            </div>
            <button onClick={() => setConfirmingProduct(product)} className="mt-4 w-full py-3 bg-[#002F6C] text-white rounded-xl font-bold uppercase text-xs">Redimir</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
