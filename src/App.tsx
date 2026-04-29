import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { ShoppingCart, LogOut, Package, User as UserIcon, Send } from 'lucide-react';
import { RAW_USERS } from './users';
import { PRODUCTS } from './constants';
import { User, Product, OrderDetails } from './types';
import Login from './Login';
import Catalog from './Catalog';
import Dashboard from './Dashboard';
import Wishlist from './Wishlist';
import Redeemed from './Redeemed';
import RedemptionComprobante from './RedemptionComprobante';

// --- CONFIGURACIÓN DE ENVÍO ---
const COMERCIALES_CORREOS: Record<string, string> = {
  'LUBRICAFE': 'grodriguez@prolub.com.co',
  'MAQUINAGRO': 'cblanco@prolub.com.co',
  'JAIRO SÁNCHEZ': 'cblanco@prolub.com.co',
  'UNIVERSAL': 'oramirez@prolub.com.co',
  'DISTRIBUIDORA LOS LAGOS': 'cblanco@prolub.com.co',
  'GRUPO MOTOR': 'oramirez@prolub.com.co',
  'RAMOS DISTRIBUCIONES': 'grodriguez@prolub.com.co',
  'SERVITECAS': 'cblanco@prolub.com.co'
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'catalog' | 'dashboard' | 'wishlist' | 'redeemed'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showComprobante, setShowComprobante] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const handleLogin = (email: string, pass: string) => {
    const found = RAW_USERS.find(u => u.email === email && u.password === pass);
    if (found) setUser(found);
    else alert('Credenciales incorrectas');
  };

  const handleRedeem = async (product: Product, details: OrderDetails) => {
    if (!user) return;

    // 1. Preparar datos para EmailJS
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
      // 2. Enviar Correo
      await emailjs.send(
        'service_x7n514r', 
        'template_zaf2ohc', 
        emailData, 
        'gM5-A17C2kxFykMOL'
      );

      // 3. Actualizar estado local
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
      alert('Hubo un error al procesar el pedido. Intenta de nuevo.');
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#001e62] text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-width-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="https://i.postimg.cc/ZnLGKtsg/Logo-GULF-2.png" alt="Gulf" className="h-10" />
            <span className="hidden md:inline font-bold">Programa de Incentivos</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs opacity-80">{user.name}</p>
              <p className="font-bold text-orange-400">{user.points.toLocaleString()} pts</p>
            </div>
            <button onClick={() => setView('catalog')} className="hover:text-orange-400"><ShoppingCart size={20} /></button>
            <button onClick={() => setView('redeemed')} className="hover:text-orange-400"><Package size={20} /></button>
            <button onClick={() => setUser(null)} className="hover:text-red-400"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      {/* Vistas */}
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
