import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { ShoppingCart, LogOut, Package, User as UserIcon } from 'lucide-react';
import { RAW_USERS } from './users';
import { PRODUCTS } from './constants';
import { User, Product, OrderDetails } from './types';
import Login from './Login';
import Catalog from './Catalog';
import Redeemed from './Redeemed';
import RedemptionComprobante from './RedemptionComprobante';

// --- CONFIGURACIÓN DE COMERCIALES POR DISTRIBUIDOR ---
const COMERCIALES_CORREOS: Record<string, string> = {
  'LUBRICAFE': 'grodriguez@prolub.com.co',
  'MAQUINAGRO': 'cblanco@prolub.com.co',
  'JAIRO SÁNCHEZ': 'cblanco@prolub.com.co',
  'UNIVERSAL': 'oramirez@prolub.com.co',
  'DISTRIBUIDORA LOS LAGOS': 'cblanco@prolub.com.co',
  'GRUPO MOTOR': 'oramirez@prolub.com.co',
  'RAMOS DISTRIBUCIONES': 'grodriguez@prolub.com.co',
  'SERVITECAS': 'cblanco@prolub.com.co', // <-- Aquí faltaba esta coma
  'PRUEBA': 'msilva@prolub.com.co'
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'catalog' | 'redeemed'>('catalog');
  const [showComprobante, setShowComprobante] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const handleLogin = (email: string, pass: string) => {
    const found = RAW_USERS.find(u => u.email === email && u.password === pass);
    if (found) setUser(found);
    else alert('Credenciales incorrectas');
  };

  const handleRedeem = async (product: Product, details: OrderDetails) => {
    if (!user) return;

    const emailData = {
      to_email: COMERCIALES_CORREOS[user.distributor] || 'msilva@prolub.com.co',
      user_name: user.name,
      distributor: user.distributor,
      product_name: product.name,
      points: product.price.toLocaleString(),
      receiver_name: details.receiverName,
      contact_name: details.contactName,
      phone: details.phone,
      city: details.city,
      address: details.address,
      reference: details.reference || 'N/A'
    };

    try {
      await emailjs.send(
        'service_x7n514r', 
        'template_zaf2ohc', 
        emailData, 
        'gM5-A17C2kxFykMOL'
      );

      const newOrder = {
        ...details,
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toLocaleDateString(),
        productName: product.name,
        points: product.price
      };

      setLastOrder(newOrder);
      setUser({ ...user, points: user.points - product.price });
      setShowComprobante(true);
      
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      alert('Error técnico al enviar el pedido.');
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#001e62] text-white p-4 sticky top-0 z-50 shadow-lg border-b-4 border-[#ff4f00]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="https://i.postimg.cc/ZnLGKtsg/Logo-GULF-2.png" alt="Gulf Logo" className="h-10" />
            <span className="hidden md:inline font-bold tracking-wider">TIENDA DE INCENTIVOS</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs opacity-80 uppercase tracking-tighter">{user.name}</p>
              <p className="font-bold text-[#ff4f00]">{user.points.toLocaleString()} PTS</p>
            </div>
            <button 
              onClick={() => setView('catalog')} 
              className={`p-2 rounded-full transition ${view === 'catalog' ? 'bg-[#ff4f00]' : 'hover:bg-blue-800'}`}
              title="Catálogo"
            >
              <ShoppingCart size={20} />
            </button>
            <button 
              onClick={() => setView('redeemed')} 
              className={`p-2 rounded-full transition ${view === 'redeemed' ? 'bg-[#ff4f00]' : 'hover:bg-blue-800'}`}
              title="Mis Pedidos"
            >
              <Package size={20} />
            </button>
            <button onClick={() => setUser(null)} className="p-2 rounded-full hover:bg-red-600 transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {view === 'catalog' && <Catalog products={PRODUCTS} userPoints={user.points} onRedeem={handleRedeem} />}
        {view === 'redeemed' && <Redeemed user={user} />}
      </main>

      {showComprobante && lastOrder && (
        <RedemptionComprobante 
          order={lastOrder} 
          onClose={() => { setShowComprobante(false); setView('catalog'); }} 
        />
      )}
    </div>
  );
}

export default App;
