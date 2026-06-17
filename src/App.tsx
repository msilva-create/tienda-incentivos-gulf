import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { User, ViewState, MonthlyRecord, Order, OrderStatus } from './types';
import { RAW_USERS } from './users';
import { RedeemedItem, Product } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Catalog from './components/Catalog';
import Wishlist from './components/Wishlist';
import { Heart, LayoutDashboard, ShoppingBag, Trophy, UserCircle, ReceiptText } from 'lucide-react';
import Redeemed from './components/Redeemed';
import RedemptionComprobante from './components/RedemptionComprobante';

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx2RedpNt2hvEhLZTcqrr4j1ZndFXUG0TXy-SU4GzS12IRdHi8Mko8voB-j9Up9XdOf8w/exec';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(RAW_USERS);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [redeemedItems, setRedeemedItems] = useState<RedeemedItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);

  const DEFAULT_REDEEMED: RedeemedItem[] = [
    // FEBRERO
    { id: 'R-1773109805069', productId: 'hm1', productName: 'Sofá cama', price: 850000, date: '2026-02-10T12:00:00Z', userEmail: 'samuel@lubricafe', distributor: 'LUBRICAFE' },
    // MARZO
    { id: 'R-lagos-luis-tv-mar', productId: 'te2', productName: 'Televisor 40" LED UHD 4K', price: 1800000, date: '2026-03-15T12:00:00Z', userEmail: 'luis@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-dayana-vent-mar', productId: 'e14', productName: 'Ventilador 3 en 1', price: 239880, date: '2026-03-15T12:00:00Z', userEmail: 'dayana@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-dayana-sand-mar', productId: 'e8', productName: 'Sanduchera Electrica 2 Puestos', price: 96000, date: '2026-03-15T12:00:00Z', userEmail: 'dayana@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-milton-vajilla-mar', productId: 'hm3', productName: 'Juego de vajilla 4 puestos', price: 120000, date: '2026-03-15T12:00:00Z', userEmail: 'milton@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-milton-vent-mar', productId: 'e14', productName: 'Ventilador 3 en 1', price: 239880, date: '2026-03-15T12:00:00Z', userEmail: 'milton@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-milton-ollas-mar', productId: 'hm4', productName: 'Bateria de ollas', price: 240000, date: '2026-03-15T12:00:00Z', userEmail: 'milton@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-maquinagro-gabriel-samsung-mar', productId: 'c1', productName: 'Samsung Galaxy A16 · 256 GB · 8 GB RAM', price: 1080000, date: '2026-03-20T12:00:00Z', userEmail: 'gabriel@maquinagro', distributor: 'MAQUINAGRO' },
    { id: 'R-lubricafe-samuel-tv65-mar', productId: 'te5', productName: 'Televisor 65" LED UHD 4K', price: 4000000, date: '2026-03-20T12:00:00Z', userEmail: 'samuel@lubricafe', distributor: 'LUBRICAFE' },
    { id: 'R-lubricafe-samuel-picatodo-mar', productId: 'e2', productName: 'Picatodo Negro', price: 131880, date: '2026-03-20T12:00:00Z', userEmail: 'samuel@lubricafe', distributor: 'LUBRICAFE' },
    // ABRIL
    { id: 'R-lagos-dayana-panini-apr', productId: 'e7', productName: 'Sanduchera Panini', price: 119400, date: '2026-04-01T12:00:00Z', userEmail: 'dayana@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-dayana-cepillo-apr', productId: 'b5', productName: 'Cepillo Secador Babyliss', price: 300000, date: '2026-04-01T12:00:00Z', userEmail: 'dayana@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-silvia-vajilla-apr', productId: 'hm3', productName: 'Juego de vajilla 4 puestos', price: 120000, date: '2026-04-01T12:00:00Z', userEmail: 'silvia@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-lagos-almacen-horno-apr', productId: 'e9', productName: 'Horno Electrico', price: 265080, date: '2026-04-01T12:00:00Z', userEmail: 'almacen@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-maquinagro-miriam-laptop-apr', productId: 'ct1', productName: 'Portátil HP 14"', price: 1978800, date: '2026-04-01T12:00:00Z', userEmail: 'miriam@maquinagro', distributor: 'MAQUINAGRO' },
    // MAYO
    { id: 'R-lubricafe-luzpiedad-plancha-may', productId: 'e16', productName: 'Plancha De Vapor Ligera', price: 131880, date: '2026-05-01T12:00:00Z', userEmail: 'luz.piedad@lubricafe', distributor: 'LUBRICAFE' },
    { id: 'R-lubricafe-luzpiedad-vent-may', productId: 'e12', productName: 'Ventilador De Piso', price: 298680, date: '2026-05-01T12:00:00Z', userEmail: 'luz.piedad@lubricafe', distributor: 'LUBRICAFE' },
    { id: 'R-lubricafe-luzpiedad-tablet-may', productId: 'ct2', productName: 'Tablet SAMSUNG', price: 1919880, date: '2026-05-01T12:00:00Z', userEmail: 'luz.piedad@lubricafe', distributor: 'LUBRICAFE' },
    { id: 'R-lubricafe-monica-bono-gorra-may', productId: 'bp2', productName: 'Bono Éxito $30.000 + Gorra GULF', price: 50000, date: '2026-05-01T12:00:00Z', userEmail: 'monica@lubricafe', distributor: 'LUBRICAFE' },
    { id: 'R-lubricafe-monica-olla-may', productId: 'e6', productName: 'Olla Eléctrica Multifunción', price: 479880, date: '2026-05-01T12:00:00Z', userEmail: 'monica@lubricafe', distributor: 'LUBRICAFE' },
    { id: 'R-lubricafe-monica-parlante-may', productId: 'te7', productName: 'Parlante Clip 5 JBL', price: 340000, date: '2026-05-01T12:00:00Z', userEmail: 'monica@lubricafe', distributor: 'LUBRICAFE' },
    { id: 'R-ramos-alexander-proyector-may', productId: 'te15', productName: 'Mini Proyector WiFi y Bluetooth - Resolución nativa 1080P', price: 350000, date: '2026-05-01T12:00:00Z', userEmail: 'alexander.ramos', distributor: 'RAMOS DISTRIBUCIONES' },
    { id: 'R-ramos-alexander-aspiradora-may', productId: 'bp9', productName: 'Bono Éxito $80.000 + Aspiradora Vertical Mano Hogar Carro Inalámbrica', price: 200000, date: '2026-05-01T12:00:00Z', userEmail: 'alexander.ramos', distributor: 'RAMOS DISTRIBUCIONES' },
    { id: 'R-ramos-alexander-humidificador-may', productId: 'bp13', productName: 'Bono Éxito $50.000 + Mini Humidificador USB', price: 100000, date: '2026-05-01T12:00:00Z', userEmail: 'alexander.ramos', distributor: 'RAMOS DISTRIBUCIONES' },
    { id: 'R-ramos-alexander-freidora-may', productId: 'e3', productName: 'Freidora de aire 4 Litros', price: 416280, date: '2026-05-01T12:00:00Z', userEmail: 'alexander.ramos', distributor: 'RAMOS DISTRIBUCIONES' },
    { id: 'R-ramos-alexander-soporte-may', productId: 'bp1', productName: 'Bono Éxito $30.000 + Soporte Celular Gulf', price: 50000, date: '2026-05-01T12:00:00Z', userEmail: 'alexander.ramos', distributor: 'RAMOS DISTRIBUCIONES' },
        { id: 'R-lagos-almacen-proyector-may', productId: 'te15', productName: 'Mini Proyector WiFi y Bluetooth - Resolución nativa 1080P', price: 350000, date: '2026-05-15T12:00:00Z', userEmail: 'almacen@loslagos', distributor: 'DISTRIBUIDORA LOS LAGOS' },
    { id: 'R-servitecas-miguel-ahumador-may', productId: 'hm-ahumador', productName: 'Ahumador y Asador de Barril Mediano 20 Lbs', price: 600000, date: '2026-05-25T12:00:00Z', userEmail: 'miguel@servitecas', distributor: 'CVC SERVITECAS' },
  ];
  const DEFAULT_RECORDS: MonthlyRecord[] = [
    { id: 'default-giovanni-feb', userId: '7', userName: 'Giovanni Del Duca', distributor: 'UNIVERSAL', month: 'Febrero', gallonsSold: 828, valuePerGallon: 800, amountLoaded: 662400, redeemed: 0, availableBalance: 662400, observations: 'Carga mensual Febrero', date: '2026-02-28T12:00:00Z' },
    { id: 'default-jhonny-feb', userId: '9', userName: 'Jhonny Stefanell', distributor: 'UNIVERSAL', month: 'Febrero', gallonsSold: 1247, valuePerGallon: 1000, amountLoaded: 1247000, redeemed: 0, availableBalance: 1247000, observations: 'Carga mensual Febrero', date: '2026-02-28T12:00:00Z' },
    { id: 'default-gabriel-feb', userId: '1', userName: 'Gabriel', distributor: 'MAQUINAGRO', month: 'Febrero', gallonsSold: 710, valuePerGallon: 600, amountLoaded: 426000, redeemed: 0, availableBalance: 426000, observations: 'Carga saldo febrero', date: '2026-02-28T12:00:00Z' },
    { id: 'default-miriam-feb', userId: '2', userName: 'Miriam', distributor: 'MAQUINAGRO', month: 'Febrero', gallonsSold: 704, valuePerGallon: 600, amountLoaded: 422400, redeemed: 0, availableBalance: 422400, observations: 'Carga saldo febrero', date: '2026-02-28T12:00:00Z' },
    { id: 'default-vacante-feb', userId: '3', userName: 'Vacante', distributor: 'MAQUINAGRO', month: 'Febrero', gallonsSold: 91, valuePerGallon: 0, amountLoaded: 0, redeemed: 0, availableBalance: 0, observations: 'Carga saldo febrero', date: '2026-02-28T12:00:00Z' },
    { id: 'default-gabriel-apr', userId: '1', userName: 'Gabriel', distributor: 'MAQUINAGRO', month: 'Abril', gallonsSold: 688, valuePerGallon: 500, amountLoaded: 344000, redeemed: 0, availableBalance: 344000, observations: 'Carga acumulativa Abril', date: '2026-04-15T12:00:00Z' },
    { id: 'default-miriam-apr', userId: '2', userName: 'Miriam', distributor: 'MAQUINAGRO', month: 'Abril', gallonsSold: 984, valuePerGallon: 800, amountLoaded: 787200, redeemed: 0, availableBalance: 787200, observations: 'Carga acumulativa Abril', date: '2026-04-15T12:00:00Z' },
    { id: 'default-vacante-apr', userId: '3', userName: 'Vacante', distributor: 'MAQUINAGRO', month: 'Abril', gallonsSold: 232, valuePerGallon: 0, amountLoaded: 0, redeemed: 0, availableBalance: 0, observations: 'Carga acumulativa Abril', date: '2026-04-15T12:00:00Z' },
    { id: 'default-luz-piedad-jan', userId: 'lc1', userName: 'Luz Piedad', distributor: 'LUBRICAFE', month: 'Enero', gallonsSold: 814, valuePerGallon: 800, amountLoaded: 651200, redeemed: 0, availableBalance: 651200, observations: 'Carga saldo enero', date: '2026-01-31T12:00:00Z' },
    { id: 'default-monica-jan', userId: 'lc2', userName: 'Monica', distributor: 'LUBRICAFE', month: 'Enero', gallonsSold: 984, valuePerGallon: 900, amountLoaded: 885600, redeemed: 0, availableBalance: 885600, observations: 'Carga saldo enero', date: '2026-01-31T12:00:00Z' },
    { id: 'default-melissa-jan', userId: 'lc3', userName: 'Melissa', distributor: 'LUBRICAFE', month: 'Enero', gallonsSold: 825, valuePerGallon: 800, amountLoaded: 660000, redeemed: 0, availableBalance: 660000, observations: 'Carga saldo enero', date: '2026-01-31T12:00:00Z' },
    { id: 'default-samuel-jan', userId: 'lc4', userName: 'Samuel', distributor: 'LUBRICAFE', month: 'Enero', gallonsSold: 1682, valuePerGallon: 1000, amountLoaded: 1682000, redeemed: 0, availableBalance: 1682000, observations: 'Carga saldo enero', date: '2026-01-31T12:00:00Z' },
    { id: 'default-samuel-apr', userId: 'lc4', userName: 'Samuel', distributor: 'LUBRICAFE', month: 'Abril', gallonsSold: 1490, valuePerGallon: 1000, amountLoaded: 1490000, redeemed: 0, availableBalance: 1490000, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-luz-piedad-apr', userId: 'lc1', userName: 'Luz Piedad', distributor: 'LUBRICAFE', month: 'Abril', gallonsSold: 1007, valuePerGallon: 1000, amountLoaded: 1007000, redeemed: 0, availableBalance: 1007000, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-melissa-apr', userId: 'lc3', userName: 'Melissa', distributor: 'LUBRICAFE', month: 'Abril', gallonsSold: 867, valuePerGallon: 800, amountLoaded: 693600, redeemed: 0, availableBalance: 693600, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-miguel-jan', userId: 'sv2', userName: 'Miguel Vargas', distributor: 'CVC SERVITECAS', month: 'Enero', gallonsSold: 1281, valuePerGallon: 800, amountLoaded: 1024800, redeemed: 0, availableBalance: 1024800, observations: 'Carga saldo enero', date: '2026-01-31T12:00:00Z' },
    { id: 'default-miguel-feb', userId: 'sv2', userName: 'Miguel Vargas', distributor: 'CVC SERVITECAS', month: 'Febrero', gallonsSold: 1219, valuePerGallon: 800, amountLoaded: 975200, redeemed: 0, availableBalance: 975200, observations: 'Carga saldo febrero', date: '2026-02-28T12:00:00Z' },
    { id: 'default-miguel-mar', userId: 'sv2', userName: 'Miguel Vargas', distributor: 'CVC SERVITECAS', month: 'Marzo', gallonsSold: 1041, valuePerGallon: 800, amountLoaded: 832800, redeemed: 0, availableBalance: 832800, observations: 'Carga saldo marzo', date: '2026-03-31T12:00:00Z' },
    { id: 'default-giovanni-mar', userId: '7', userName: 'Giovanni Del Duca', distributor: 'UNIVERSAL', month: 'Marzo', gallonsSold: 810, valuePerGallon: 800, amountLoaded: 648000, redeemed: 0, availableBalance: 648000, observations: 'Carga saldo marzo', date: '2026-03-31T12:00:00Z' },
    { id: 'default-yerlin-mar', userId: 'un5', userName: 'YERLIN MOLINA', distributor: 'UNIVERSAL', month: 'Marzo', gallonsSold: 802, valuePerGallon: 800, amountLoaded: 641600, redeemed: 0, availableBalance: 641600, observations: 'Carga saldo marzo', date: '2026-03-31T12:00:00Z' },
    { id: 'default-zaid-mar', userId: '8', userName: 'Zaid Murgas', distributor: 'UNIVERSAL', month: 'Marzo', gallonsSold: 1203, valuePerGallon: 1000, amountLoaded: 1203000, redeemed: 0, availableBalance: 1203000, observations: 'Carga saldo marzo', date: '2026-03-31T12:00:00Z' },
    { id: 'default-jhonny-mar', userId: '9', userName: 'Jhonny Steffanell', distributor: 'UNIVERSAL', month: 'Marzo', gallonsSold: 1309, valuePerGallon: 1000, amountLoaded: 1309000, redeemed: 0, availableBalance: 1309000, observations: 'Carga saldo marzo', date: '2026-03-31T12:00:00Z' },
    { id: 'default-jhonny-apr', userId: '9', userName: 'Jhonny Steffanell', distributor: 'UNIVERSAL', month: 'Abril', gallonsSold: 2187, valuePerGallon: 1000, amountLoaded: 2187000, redeemed: 0, availableBalance: 2187000, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-zaid-apr', userId: '8', userName: 'Zaid Murgas', distributor: 'UNIVERSAL', month: 'Abril', gallonsSold: 1307, valuePerGallon: 1000, amountLoaded: 1307000, redeemed: 0, availableBalance: 1307000, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-juandavid-apr', userId: 'rd4', userName: 'JUAN DAVID RAMOS', distributor: 'RAMOS DISTRIBUCIONES', month: 'Abril', gallonsSold: 1100, valuePerGallon: 500, amountLoaded: 550000, redeemed: 0, availableBalance: 550000, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-mauricio-apr', userId: 'rd5', userName: 'MAURICIO QUICENO', distributor: 'RAMOS DISTRIBUCIONES', month: 'Abril', gallonsSold: 297, valuePerGallon: 600, amountLoaded: 178200, redeemed: 0, availableBalance: 178200, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-alexander-apr', userId: 'rd1', userName: 'ALEXANDER LABRADA', distributor: 'RAMOS DISTRIBUCIONES', month: 'Abril', gallonsSold: 1008, valuePerGallon: 1000, amountLoaded: 1008000, redeemed: 0, availableBalance: 1008000, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-santiago-apr', userId: 'rd2', userName: 'SANTIAGO RAMOS', distributor: 'RAMOS DISTRIBUCIONES', month: 'Abril', gallonsSold: 1400, valuePerGallon: 1000, amountLoaded: 1400000, redeemed: 0, availableBalance: 1400000, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    { id: 'default-jorge-apr', userId: 'rd7', userName: 'JORGE MARIN', distributor: 'RAMOS DISTRIBUCIONES', month: 'Abril', gallonsSold: 163, valuePerGallon: 600, amountLoaded: 97800, redeemed: 0, availableBalance: 97800, observations: 'Carga saldo abril', date: '2026-04-30T12:00:00Z' },
    // MAYO
    { id: 'default-miguel-may', userId: 'sv2', userName: 'Miguel Vargas', distributor: 'CVC SERVITECAS', month: 'Mayo', gallonsSold: 1121, valuePerGallon: 800, amountLoaded: 896800, redeemed: 0, availableBalance: 896800, observations: 'Carga saldo mayo', date: '2026-05-25T12:00:00Z' },
    { id: 'default-cesar-may', userId: 'sv1', userName: 'César Cruz', distributor: 'CVC SERVITECAS', month: 'Mayo', gallonsSold: 861, valuePerGallon: 800, amountLoaded: 688800, redeemed: 0, availableBalance: 688800, observations: 'Carga saldo mayo', date: '2026-05-25T12:00:00Z' },
    { id: 'default-miriam-may', userId: '2', userName: 'Miriam', distributor: 'MAQUINAGRO', month: 'Mayo', gallonsSold: 948, valuePerGallon: 700, amountLoaded: 663600, redeemed: 0, availableBalance: 663600, observations: 'Carga saldo mayo', date: '2026-05-25T12:00:00Z' },
  ];
  const [comprobanteData, setComprobanteData] = useState<{ item: RedeemedItem; user: User; id: string; status: string } | null>(null);

  useEffect(() => {
    const APP_VERSION = '1.0.8';
    const savedVersion = localStorage.getItem('gulf_version');
    if (savedVersion !== APP_VERSION) {
      localStorage.clear();
      localStorage.setItem('gulf_version', APP_VERSION);
      window.location.reload();
      return;
    }

    const savedUsers = localStorage.getItem('gulf_all_users');
    const savedRedeemed = localStorage.getItem('gulf_redeemed');
    let redeemed: RedeemedItem[] = savedRedeemed ? JSON.parse(savedRedeemed) : [];
    const existingRedemptionIds = new Set(redeemed.map(r => r.id));
    const newDefaultRedeemed = DEFAULT_REDEEMED.filter(r => !existingRedemptionIds.has(r.id));
    if (newDefaultRedeemed.length > 0) redeemed = [...redeemed, ...newDefaultRedeemed];

    const savedMonthlyRecords = localStorage.getItem('gulf_monthly_records');
    let monthlyRecordsFromStorage: MonthlyRecord[] = savedMonthlyRecords ? JSON.parse(savedMonthlyRecords) : [];
    const existingRecordIds = new Set(monthlyRecordsFromStorage.map(r => r.id));
    const newDefaultRecords = DEFAULT_RECORDS.filter(r => !existingRecordIds.has(r.id));
    if (newDefaultRecords.length > 0) monthlyRecordsFromStorage = [...monthlyRecordsFromStorage, ...newDefaultRecords];

    let parsedUsers: User[] = savedUsers ? JSON.parse(savedUsers) : RAW_USERS;
    const rawUsersMap = new Map(RAW_USERS.map(u => [u.email, u]));
    parsedUsers = parsedUsers.map(u => {
      const rawUser = rawUsersMap.get(u.email);
      if (rawUser && (u.balance !== rawUser.balance || u.gallons !== rawUser.gallons)) {
        return { ...u, name: rawUser.name, distributor: rawUser.distributor, gallons: rawUser.gallons, balance: rawUser.balance, initialGallons: rawUser.initialGallons, initialBalance: rawUser.initialBalance, monthlyBalances: rawUser.monthlyBalances, password: rawUser.password };
      }
      return u;
    });

    const existingEmails = new Set(parsedUsers.map(u => u.email));
    const newUsers = RAW_USERS.filter(u => !existingEmails.has(u.email));
    if (newUsers.length > 0) parsedUsers = [...parsedUsers, ...newUsers];

    const migratedUsers = parsedUsers.map(u => {
      if (u.role === 'ADMIN') return u;
      if (u.initialBalance !== undefined) return u;
      const userRedemptions = redeemed.filter((ri: any) => ri.userEmail === u.email);
      const totalRedeemed = userRedemptions.reduce((sum: number, ri: any) => sum + ri.price, 0);
      const userRecords = monthlyRecordsFromStorage.filter(r => r.userId === u.id);
      const totalLoaded = userRecords.reduce((sum, r) => sum + r.amountLoaded, 0);
      const totalGallonsLoaded = userRecords.reduce((sum, r) => sum + r.gallonsSold, 0);
      return { ...u, initialBalance: u.balance + totalRedeemed - totalLoaded, initialGallons: u.gallons - totalGallonsLoaded };
    });

    setUsers(migratedUsers);
    setRedeemedItems(redeemed);
    setMonthlyRecords(monthlyRecordsFromStorage);

    const savedOrders = localStorage.getItem('gulf_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedUser = localStorage.getItem('gulf_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role === 'ADMIN' && parsedUser.email !== 'admin.gulf') {
        localStorage.removeItem('gulf_user');
        setUser(null);
        alert("Acceso no autorizado.");
        return;
      }
      setUser(parsedUser);
      const isCentral = parsedUser.distributor === 'CENTRAL GULF' || parsedUser.distributor === 'GULF CENTRAL' || parsedUser.email === 'admin.gulf';
      setActiveView(isCentral ? 'admin' : 'catalog');
    }
    const savedWishlist = localStorage.getItem('gulf_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => { localStorage.setItem('gulf_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('gulf_redeemed', JSON.stringify(redeemedItems)); }, [redeemedItems]);
  useEffect(() => { localStorage.setItem('gulf_monthly_records', JSON.stringify(monthlyRecords)); }, [monthlyRecords]);
  useEffect(() => { localStorage.setItem('gulf_all_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('gulf_orders', JSON.stringify(orders)); }, [orders]);

  useEffect(() => {
    if (user) {
      const updatedUser = users.find(u => u.id === user.id);
      if (updatedUser && user.balance !== updatedUser.balance) {
        const newUser = { ...updatedUser };
        setUser(newUser);
        localStorage.setItem('gulf_user', JSON.stringify(newUser));
      }
    }
  }, [users, user?.id]);

  useEffect(() => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.role === 'ADMIN') return u;
      const userRecords = monthlyRecords.filter(r => r.userId === u.id);
      const totalLoaded = userRecords.reduce((sum, r) => sum + r.amountLoaded, 0);
      const userRedemptions = redeemedItems.filter(ri => ri.userEmail === u.email);
      const totalRedeemed = userRedemptions.reduce((sum, ri) => sum + ri.price, 0);
      const newBalance = (u.initialBalance || 0) + totalLoaded - totalRedeemed;
      const totalGallons = (u.initialGallons || 0) + userRecords.reduce((sum, r) => sum + r.gallonsSold, 0);
      if (u.balance !== newBalance || u.gallons !== totalGallons) return { ...u, balance: newBalance, gallons: totalGallons };
      return u;
    }));
  }, [monthlyRecords, redeemedItems]);

  const handleAddMonthlyRecord = (record: Omit<MonthlyRecord, 'id' | 'date'>) => {
    setMonthlyRecords(prev => [...prev, { ...record, id: `REC-${Date.now()}`, date: new Date().toISOString() }]);
  };
  const handleUpdateMonthlyRecord = (record: MonthlyRecord) => {
    setMonthlyRecords(prev => prev.map(r => r.id === record.id ? record : r));
  };
  const handleDeleteMonthlyRecord = (recordId: string) => {
    setMonthlyRecords(prev => prev.filter(r => r.id !== recordId));
  };
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleCreateOrder = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    const newItem: RedeemedItem = {
      id: order.id,
      productId: order.productId,
      productName: order.productName,
      price: order.discountedBalance,
      date: order.requestDate,
      userEmail: order.userEmail,
      distributor: order.distributor
    };
    setRedeemedItems(prev => [newItem, ...prev]);

    try {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch (err) {
      console.warn('No se pudo guardar en Sheets:', err);
    }

    const distributorEmails: Record<string, string> = {
      'LUBRICAFE': 'grodriguez@prolub.com.co',
      'MAQUINAGRO': 'cblanco@prolub.com.co',
      'JAIRO SANCHEZ': 'cblanco@prolub.com.co',
      'UNIVERSAL': 'oramirez@prolub.com.co',
      'DISTRIBUIDORA LOS LAGOS': 'cblanco@prolub.com.co',
      'GRUPO MOTOR': 'oramirez@prolub.com.co',
      'RAMOS DISTRIBUCIONES': 'grodriguez@prolub.com.co',
      'CVC SERVITECAS': 'cblanco@prolub.com.co',
    };

    const commercialEmail = distributorEmails[order.distributor] || 'msilva@prolub.com.co';

    try {
      const formatCurrencyEmail = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

      // ✅ UN SOLO correo interno a msilva con CC al comercial del distribuidor
      await emailjs.send('service_x7n514r', 'template_zaf2ohc', {
        to_email: 'msilva@prolub.com.co',
        cc_email: commercialEmail,
        user_name: order.commercial,
        distributor: order.distributor,
        product_name: order.productName,
        points: formatCurrencyEmail(order.discountedBalance),
        receiver_name: order.recipientName,
        contact_name: order.contactName,
        client_email: order.clientEmail,
        phone: order.phone,
        city: order.city,
        address: order.address,
        observations: order.observations || 'Sin observaciones',
      }, 'gM5-A17C2kxFykMOL');

      // ✅ Correo al cliente si proporcionó su email
      if (order.clientEmail) {
        await emailjs.send('service_x7n514r', 'template_j68x3t7', {
          client_email: order.clientEmail,
          receiver_name: order.recipientName,
          product_name: order.productName,
          points: formatCurrencyEmail(order.discountedBalance),
          user_name: order.commercial,
          distributor: order.distributor,
          city: order.city,
        }, 'gM5-A17C2kxFykMOL');
      }
    } catch (error) {
      console.warn('Error enviando email:', error);
    }
  };

  const handleLogin = (loggedUser: User) => {
    if (loggedUser.role === 'ADMIN' && loggedUser.email !== 'admin.gulf') {
      alert("Acceso no autorizado.");
      return;
    }
    setUser(loggedUser);
    localStorage.setItem('gulf_user', JSON.stringify(loggedUser));
    const isCentral = loggedUser.distributor === 'CENTRAL GULF' || loggedUser.distributor === 'GULF CENTRAL' || loggedUser.email === 'admin.gulf';
    setActiveView(isCentral ? 'admin' : 'catalog');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('dashboard');
    localStorage.removeItem('gulf_user');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const handleRedeem = (product: Product) => {
    if (!user) return;
    const newRedeemedItem: RedeemedItem = {
      productId: product.id,
      productName: product.name + (user.distributor === 'PRUEBA' ? ' (PRUEBA)' : ''),
      price: product.price,
      image: product.image,
      date: new Date().toISOString(),
      userEmail: user.email,
      distributor: user.distributor,
    };
    setRedeemedItems(prev => [...prev, newRedeemedItem]);
    alert("Tu redencion fue enviada al equipo Gulf Gana Mas.");
    const redemptionId = `R-${Date.now()}`;
    setComprobanteData({ item: newRedeemedItem, user: user, id: redemptionId, status: 'SOLICITADO' });
    setTimeout(() => {
      window.print();
      setComprobanteData(null);
    }, 500);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const isAdmin = user.email === 'admin.gulf';
  const isCentralGulf = user.distributor === 'CENTRAL GULF' || user.distributor === 'GULF CENTRAL' || isAdmin;
  const isTestUser = user.distributor === 'PRUEBA';
  const isCommercial = user.role === 'COMMERCIAL';

  const renderActiveView = () => {
    switch (activeView) {
      case 'admin':
        if (!isCentralGulf) return (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-3xl font-black text-red-600 mb-4 uppercase">ACCESO NO AUTORIZADO</h2>
            <button onClick={() => setActiveView('catalog')} className="bg-[#002F6C] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest">Volver a Mi Tienda Gulf</button>
          </div>
        );
        return <AdminDashboard users={users} monthlyRecords={monthlyRecords} orders={orders} redeemedItems={redeemedItems} onAddMonthlyRecord={handleAddMonthlyRecord} onUpdateMonthlyRecord={handleUpdateMonthlyRecord} onDeleteMonthlyRecord={handleDeleteMonthlyRecord} onUpdateOrderStatus={handleUpdateOrderStatus} />;
      case 'catalog':
        return <Catalog user={user} wishlist={wishlist} onToggleWishlist={toggleWishlist} onRedeem={handleRedeem} onCreateOrder={handleCreateOrder} onBack={isAdmin ? () => setActiveView('admin') : undefined} />;
      case 'redeemed':
        return <Redeemed user={user} orders={orders} redeemedItems={redeemedItems} onBack={() => setActiveView('catalog')} />;
      case 'wishlist':
        return <Wishlist user={user} wishlist={wishlist} onToggleWishlist={toggleWishlist} onBack={() => setActiveView('catalog')} />;
      case 'dashboard':
        return <Dashboard user={user!} users={users} monthlyRecords={monthlyRecords} onGoToCatalog={() => setActiveView('catalog')} />;
      default:
        return isAdmin
          ? <AdminDashboard users={users} monthlyRecords={monthlyRecords} orders={orders} redeemedItems={redeemedItems} onAddMonthlyRecord={handleAddMonthlyRecord} onUpdateMonthlyRecord={handleUpdateMonthlyRecord} onDeleteMonthlyRecord={handleDeleteMonthlyRecord} onUpdateOrderStatus={handleUpdateOrderStatus} />
          : <Catalog user={user!} wishlist={wishlist} onToggleWishlist={toggleWishlist} onCreateOrder={handleCreateOrder} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {isTestUser && (
        <div className="bg-red-600 text-white py-2 px-4 text-center font-black uppercase tracking-[0.3em] text-[10px] animate-pulse z-[100]">
          MODO PRUEBA - LOS MOVIMIENTOS NO AFECTAN SALDOS REALES
        </div>
      )}
      <div className="w-full racing-stripe-header sticky top-0 z-[60]"></div>
      <header className="bg-white border-b border-slate-200 sticky top-2 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col items-center">
          <div className="mb-4">
            <img src="https://i.postimg.cc/wMgp2bgd/Logo-GULF.png" alt="Gulf Logo" style={{ height: '120px', width: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between items-center pt-4 border-t border-slate-100 gap-4">
            <div className="flex flex-col text-center md:text-left">
              <h1 className="text-xs font-black text-[#002F6C] uppercase tracking-[0.2em]">
                {activeView === 'wishlist' ? 'MIS PRODUCTOS GUARDADOS' : activeView === 'redeemed' ? 'MIS PRODUCTOS REDIMIDOS' : activeView === 'admin' ? 'ADMINISTRADOR CENTRAL GULF' : isCommercial ? 'MI TIENDA GULF' : 'Tienda de Incentivos'}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.distributor}</p>
            </div>
            {isCommercial && (
              <div className="flex items-center gap-4 sm:gap-8 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
                {!isCentralGulf && (
                  <>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Saldo Disponible</p>
                      <p className="text-sm font-black text-[#FF6A00] italic">{formatCurrency(user.balance)}</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                  </>
                )}
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Galones vendidos</p>
                  <p className="text-sm font-black text-[#002F6C] italic">{user.gallons.toLocaleString()} gal</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 sm:gap-4">
              {isAdmin ? (
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-full border border-slate-100">
                  <button onClick={() => setActiveView('admin')} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'admin' ? 'bg-[#002F6C] text-white shadow-md' : 'text-slate-400 hover:text-[#002F6C]'}`}>
                    <LayoutDashboard size={12} /> <span className="hidden sm:inline">Admin Central</span>
                  </button>
                  <button onClick={() => setActiveView('dashboard')} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'dashboard' ? 'bg-[#002F6C] text-white shadow-md' : 'text-slate-400 hover:text-[#002F6C]'}`}>
                    <Trophy size={12} /> <span className="hidden sm:inline">Escuderias</span>
                  </button>
                  <button onClick={() => setActiveView('catalog')} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'catalog' ? 'bg-[#002F6C] text-white shadow-md' : 'text-slate-400 hover:text-[#002F6C]'}`}>
                    <ShoppingBag size={12} /> <span className="hidden sm:inline">Catalogo</span>
                  </button>
                  <button onClick={() => setActiveView('redeemed')} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'redeemed' ? 'bg-[#002F6C] text-white shadow-md' : 'text-slate-400 hover:text-[#002F6C]'}`}>
                    <ReceiptText size={12} /> <span className="hidden sm:inline">Redimidos</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveView('catalog')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'catalog' ? 'bg-[#002F6C] text-white shadow-lg' : 'text-slate-400 hover:text-[#002F6C]'}`}>
                    Tienda
                  </button>
                  <button onClick={() => setActiveView('wishlist')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 ${activeView === 'wishlist' ? 'bg-[#FF6A00] text-white shadow-lg' : 'text-slate-400 hover:text-[#FF6A00]'}`}>
                    <Heart size={12} fill={activeView === 'wishlist' ? "white" : "none"} /> Mis Guardados
                  </button>
                  <button onClick={() => setActiveView('redeemed')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 ${activeView === 'redeemed' ? 'bg-[#002F6C] text-white shadow-lg' : 'text-slate-400 hover:text-[#002F6C]'}`}>
                    <ReceiptText size={12} fill={activeView === 'redeemed' ? "white" : "none"} /> Redimidos
                  </button>
                </div>
              )}
              <div className="text-right hidden xl:block">
                <p className="text-xs font-black text-[#002F6C] uppercase leading-none mb-1">{user.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <UserCircle size={10} className="text-[#FF6A00]" />
                  <p className="text-[9px] text-[#FF6A00] font-black uppercase tracking-tighter">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest transition-all hover:shadow-lg active:scale-95">
                SALIR
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">{renderActiveView()}</main>

      {/* Botón flotante WhatsApp */}
      <a
        href="https://wa.me/573219440824?text=Hola,%20necesito%20ayuda%20con%20la%20tienda%20Gulf"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[999] bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        ¿Necesitas ayuda?
      </a>

      {comprobanteData && (
        <div id="comprobante-print-area" className="fixed top-0 left-0 w-full h-full bg-white z-[9999] hidden print:block">
          <RedemptionComprobante item={comprobanteData.item} user={comprobanteData.user} id={comprobanteData.id} />
        </div>
      )}
      <footer className="bg-white py-10 text-center border-t border-slate-100 mt-12">
        <div className="container mx-auto px-4">
          <img src="https://i.postimg.cc/wMgp2bgd/Logo-GULF.png" alt="Gulf Logo" style={{ height: '60px', width: 'auto', display: 'block', margin: '0 auto', opacity: 0.2 }} className="grayscale mb-4" />
          <p className="text-[10px] font-black text-[#002F6C] uppercase tracking-[0.4em] opacity-30 mb-2">
            &copy; {new Date().getFullYear()} GULF Lubricantes - Programa de Incentivos "Vender GULF sí paga"
          </p>
          <p className="text-[9px] text-slate-400 italic">Las imagenes de los productos son de referencia.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
