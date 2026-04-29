import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CatalogProps {
  products: Product[];
  userPoints: number;
  onRedeem: (product: Product, details: any) => void;
}

const Catalog: React.FC<CatalogProps> = ({ products, userPoints, onRedeem }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ receiverName: '', phone: '', city: '', address: '' });

  const handleFinalize = () => {
    if (!form.receiverName || !form.phone || !form.city || !form.address) {
      alert('Por favor, completa todos los campos de envío');
      return;
    }
    onRedeem(selectedProduct!, form);
    setSelectedProduct(null);
    alert('¡Solicitud de redención enviada con éxito!');
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
            <img src={product.image} alt={product.name} className="h-32 object-contain mb-4" />
            <h3 className="font-bold text-[#002F6C] text-center text-sm h-10">{product.name}</h3>
            <p className="text-[#FF6A00] font-black my-2">{product.price.toLocaleString()} PTS</p>
            <button 
              onClick={() => setSelectedProduct(product)}
              disabled={userPoints < product.price}
              className={`w-full py-2 rounded-lg font-bold text-white ${userPoints >= product.price ? 'bg-[#002F6C]' : 'bg-gray-300'}`}
            >
              {userPoints >= product.price ? 'REDIMIR' : 'PUNTOS INSUFICIENTES'}
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-[#002F6C] mb-4">DATOS DE ENVÍO</h2>
            <div className="space-y-3">
              <input className="w-full border p-3 rounded-xl" placeholder="Nombre de quien recibe" onChange={e => setForm({...form, receiverName: e.target.value})} />
              <input className="w-full border p-3 rounded-xl" placeholder="Teléfono" onChange={e => setForm({...form, phone: e.target.value})} />
              <input className="w-full border p-3 rounded-xl" placeholder="Ciudad" onChange={e => setForm({...form, city: e.target.value})} />
              <input className="w-full border p-3 rounded-xl" placeholder="Dirección completa" onChange={e => setForm({...form, address: e.target.value})} />
              <button onClick={handleFinalize} className="w-full bg-[#FF6A00] text-white py-4 rounded-xl font-bold text-lg mt-4 shadow-lg">FINALIZAR REDENCIÓN</button>
              <button onClick={() => setSelectedProduct(null)} className="w-full text-gray-500 font-bold py-2">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
