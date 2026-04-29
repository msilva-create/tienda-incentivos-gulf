import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { LogOut } from 'lucide-react';
import { RAW_USERS } from './users';
import { PRODUCTS } from './constants';
import Login from './components/Login';
import Catalog from './components/Catalog';

function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (email: string, pass: string) => {
    const found = RAW_USERS.find(u => u.email === email && u.password === pass);
    if (found) setUser(found);
    else alert('Acceso incorrecto');
  };

  const handleRedeem = async (product: any, details: any) => {
    const emailData = {
      to_email: 'msilva@prolub.com.co',
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
      // Usamos tus IDs reales de EmailJS
      await emailjs.send('service_x7n514r', 'template_zaf2ohc', emailData, 'gM5-A17C2kxFykMOL');
      alert('¡Redención exitosa! El correo con el logo Gulf ha sido enviado.');
      setUser({ ...user, points: user.points - product.price });
    } catch (e) {
      alert('Error al enviar el pedido');
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#001e62] text-white p-4 flex justify-between items-center border-b-4 border-[#ff4f00] shadow-lg">
        <img src="https://i.postimg.cc/ZnLGKtsg/Logo-GULF-2.png" alt="Gulf" className="h-10" />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs opacity-80 uppercase">{user.name}</p>
            <p className="font-bold text-[#ff4f00]">{user.points.toLocaleString()} PTS</p>
          </div>
          <button onClick={() => setUser(null)} className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition">
            <LogOut size={18} />
          </button>
        </div>
      </nav>
      <main className="p-6">
        <Catalog products={PRODUCTS} userPoints={user.points} onRedeem={handleRedeem} />
      </main>
    </div>
  );
}

export default App;
