import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { LogOut } from 'lucide-react';
import { CATALOG_PRODUCTS } from './constants';
import { User } from './types';
import Login from './components/Login';
import Catalog from './components/Catalog';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleRedeem = async (product: any, details: any) => {
    if (!user) return;
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
      await emailjs.send(
        'service_x7n514r',
        'template_zaf2ohc',
        emailData,
        'gM5-A17C2kxFykMOL'
      );
      alert('Redencion exitosa!');
      setUser({ ...user, balance: user.balance - product.price });
    } catch (error) {
      console.error(error);
      alert('Error tecnico al enviar el pedido.');
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#001e62] text-white p-4 flex justify-between items-center border-b-4 border-[#ff4f00] shadow-lg">
        <img src="https://i.postimg.cc/ZnLGKtsg/Logo-GULF-2.png" alt="Gulf" className="h-10" />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs opacity-80 uppercase">{user.name}</p>
            <p className="font-bold text-[#ff4f00]">{user.balance.toLocaleString()} PTS</p>
          </div>
          <button
            onClick={() => setUser(null)}
            className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
      <main className="p-6">
        <Catalog
          products={CATALOG_PRODUCTS}
          userPoints={user.balance}
          onRedeem={handleRedeem}
        />
      </main>
    </div>
  );
}

export default App;
