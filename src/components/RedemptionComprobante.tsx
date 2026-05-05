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

  const fecha = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDownloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const azul = '#002F6C';
    const naranja = '#FF6A00';
    const gris = '#64748B';

    doc.setFillColor(0, 47, 108);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setFillColor(255, 106, 0);
    doc.rect(0, 33, 210, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPROBANTE DE REDENCION', 105, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('GULF - Programa de Incentivos', 105, 27, { align: 'center' });

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(`ID: ${id}`, 15, 45);
    doc.text(`Fecha: ${fecha}`, 15, 52);

    doc.setFillColor(240, 245, 255);
    doc.rect(10, 60, 190, 45, 'F');
    doc.setDrawColor(0, 47, 108);
    doc.setLineWidth(0.3);
    doc.rect(10, 60, 190, 45, 'S');

    doc.setTextColor(0, 47, 108);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL COMERCIAL', 15, 70);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(`Nombre:`, 15, 80);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name, 45, 80);

    doc.setFont('helvetica', 'normal');
    doc.text(`Distribuidor:`, 15, 88);
    doc.setFont('helvetica', 'bold');
    doc.text(user.distributor, 45, 88);

    doc.setFont('helvetica', 'normal');
    doc.text(`Estado:`, 15, 96);
    doc.setFillColor(255, 106, 0);
    doc.roundedRect(44, 91, 30, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('SOLICITADO', 59, 96, { align: 'center' });

    doc.setFillColor(255, 248, 240);
    doc.rect(10, 115, 190, 50, 'F');
    doc.setDrawColor(255, 106, 0);
    doc.rect(10, 115, 190, 50, 'S');

    doc.setTextColor(0, 47, 108);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCTO REDIMIDO', 15, 125);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(`Producto:`, 15, 135);
    doc.setFont('helvetica', 'bold');
    const nombreLineas = doc.splitTextToSize(item.productName, 130);
    doc.text(nombreLineas, 45, 135);

    doc.setFont('helvetica', 'normal');
    doc.text(`ID Producto:`, 15, 148);
    doc.setFont('helvetica', 'bold');
    doc.text(item.productId, 45, 148);

    doc.setFont('helvetica', 'normal');
    doc.text(`Valor:`, 15, 156);
    doc.setTextColor(255, 106, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(item.price), 45, 156);

    doc.setFillColor(248, 250, 252);
    doc.rect(10, 175, 190, 30, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, 175, 190, 30, 'S');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Este comprobante es una constancia de tu solicitud de redencion.', 105, 185, { align: 'center' });
    doc.text('El equipo de Gulf Gana Mas se pondra en contacto para coordinar la entrega.', 105, 192, { align: 'center' });
    doc.text('Gracias por ser parte de Gulf Gana Mas!', 105, 199, { align: 'center' });

    doc.setFillColor(0, 47, 108);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('GULF Lubricantes - Programa de Incentivos "Vender GULF si paga"', 105, 291, { align: 'center' });

    doc.save(`Comprobante-Gulf-${id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 className="text-2xl font-black text-[#002F6C] uppercase mb-2">Solicitud Enviada</h2>
        <p className="text-slate-500 text-sm mb-6">Tu redención fue registrada exitosamente</p>

        <div className="bg-slate-50 rounded-2xl p-4 text-left mb-6 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Producto</p>
          <p className="font-black text-[#002F6C] text-sm">{item.productName}</p>
          <p className="text-[#FF6A00] font-black mt-1">{formatCurrency(item.price)}</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="w-full py-4 rounded-2xl btn-gulf font-black text-sm uppercase tracking-widest mb-3 flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Descargar Comprobante PDF
        </button>

        <p className="text-xs text-slate-400 italic">El equipo Gulf se pondrá en contacto para coordinar la entrega</p>
      </div>
    </div>
  );
};

export default RedemptionComprobante;
