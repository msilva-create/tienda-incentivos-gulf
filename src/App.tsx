import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { LogOut } from 'lucide-react';
import { RAW_USERS } from './users';
import { PRODUCTS } from './constants';
import Login from './Login';
import Catalog from './Catalog';

const COMERCIALES: Record<string, string> = {
  'LUBRICAFE': 'grodriguez@prolub.com.co',
  'MAQUINAGRO': 'cblanco@prolub.com.co',
  'PRUEBA': 'msilva@prolub.com.co'
};

function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (email: string, pass: string) => {
    const found = RAW_USERS.find(u => u.email === email && u.password === pass);
    if (found) setUser(found);
    else alert('Error de acceso');
  };

  const handleRedeem = async (product: any, details: any) => {
    const emailData = {
      to_email: COMERCIALES[user.distributor] || 'msilva@prolub.com.co',
      user_name: user.name,
      distributor: user.distributor,
      product_name: product.name,
      points: product.price.toLocaleString(),
      receiver_name: details.receiverName,
      phone: details.phone,
      city: details.city,
      address: details.address
    };

    try {
      await emailjs.send('service_x7n514r', 'template_zaf2ohc', emailData, 'gM5-A17C2kxFykMOL');
      alert('¡Redención exitosa! Revisa tu correo con el logo Gulf.');
      setUser({ ...user, points: user.points - product.price });
    } catch (e) {
      alert('Error al enviar');
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#001e62] text-white p-4 flex justify-between items-center shadow-lg border-b-4 border-[#ff4f00]">
        <img src="https://i.postimg.cc/ZnLGKtsg/Logo-GULF-2.png" alt="Gulf" className="h-10" />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs">{user.name}</p>
            <p className="font-bold text-orange-500">{user.points.toLocaleString()} PTS</p>
          </div>
          <button onClick={() => setUser(null)} className="p-2 bg-red-600 rounded-full"><LogOut size={18} /></button>
        </div>
      </nav>
      <main className="p-6">
        <Catalog products={PRODUCTS} userPoints={user.points} onRedeem={handleRedeem} />
      </main>
    </div>
  );
}
export default App;
