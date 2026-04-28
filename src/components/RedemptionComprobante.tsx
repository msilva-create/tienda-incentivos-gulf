import React from 'react';
import { RedeemedItem, User } from '../types';

interface RedemptionComprobanteProps {
  item: RedeemedItem;
  user: User;
  id: string;
}

const RedemptionComprobante: React.FC<RedemptionComprobanteProps> = ({ item, user, id }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-8 bg-white max-w-2xl mx-auto print:p-0 print:m-0 print:shadow-none" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex justify-between items-center mb-8 print:mb-4">
        <img src="https://i.postimg.cc/SQ0kdm6y/Logo-GULF-2.png" alt="Gulf Logo" className="h-16 print:h-12" />
        <h1 className="text-2xl font-black text-[#002F6C] uppercase print:text-xl">Comprobante de Redención</h1>
      </div>

      <div className="mb-6 text-sm print:text-xs">
        <p className="text-slate-600 mb-1"><strong>ID de Comprobante:</strong> {id}</p>
        <p className="text-slate-600"><strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="border border-slate-200 rounded-lg p-6 mb-6 print:p-4 print:mb-4">
        <h2 className="text-lg font-bold text-[#002F6C] mb-4 uppercase print:text-base">Detalles del Comercial</h2>
        <p className="mb-1 text-sm print:text-xs"><strong>Nombre:</strong> {user.name}</p>
        <p className="mb-1 text-sm print:text-xs"><strong>Email:</strong> {user.email}</p>
        <p className="mb-1 text-sm print:text-xs"><strong>Distribuidor:</strong> {user.distributor}</p>
        <p className="text-sm print:text-xs"><strong>Rol:</strong> {user.role}</p>
      </div>

      <div className="border border-slate-200 rounded-lg p-6 mb-8 print:p-4 print:mb-4">
        <h2 className="text-lg font-bold text-[#002F6C] mb-4 uppercase print:text-base">Producto Redimido</h2>
        <div className="flex items-center gap-4 mb-4">
          {item.image && (
            <div className="relative">
              <div className="absolute top-1 left-1 bg-[#0B2D5C]/80 text-white text-[5px] font-black uppercase tracking-widest px-1 py-0.5 rounded shadow-sm z-10 print:hidden">
                Imagen de referencia
              </div>
              <img src={item.image} alt={item.productName} className="w-20 h-20 object-contain rounded-md border border-slate-100 print:w-16 print:h-16" referrerPolicy="no-referrer" />
            </div>
          )} 
          <div>
            <p className="text-base font-bold text-[#002F6C] print:text-sm">{item.productName}</p>
            <p className="text-sm text-slate-500 print:text-xs">ID Producto: {item.productId}</p>
          </div>
        </div>
        <p className="text-xl font-black text-[#FF6A00] print:text-lg"><strong>Valor:</strong> {formatCurrency(item.price)}</p>
      </div>

      <div className="text-center text-slate-500 text-xs italic print:text-[10px]">
        <p>Este comprobante es una constancia de tu solicitud de redención.</p>
        <p>El equipo de Gulf Gana Más se pondrá en contacto para coordinar la entrega.</p>
        <p className="mt-4">¡Gracias por ser parte de Gulf Gana Más!</p>
      </div>
    </div>
  );
};

export default RedemptionComprobante;
