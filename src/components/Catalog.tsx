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
    setSe
