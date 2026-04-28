import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(RAW_USERS);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [redeemedItems, setRedeemedItems] = useState<RedeemedItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);

  // Default records that should always exist if not already present
  const DEFAULT_REDEEMED: RedeemedItem[] = [
    {
      id: 'R-1773109805069',
      productId: 'R-1773109805069',
      productName: 'Sofá cama',
      price: 850000,
      date: '2026-03-10T02:30:05.069Z',
      userEmail: 'samuel@lubricafe',
      distributor: 'LUBRICAFE'
    }
  ];

  const DEFAULT_RECORDS: MonthlyRecord[] = [
    {
      id: 'default-giovanni-feb',
      userId: '7',
      userName: 'Giovanni Del Duca',
      distributor: 'UNIVERSAL',
      month: 'Febrero',
      gallonsSold: 828,
      valuePerGallon: 800,
      amountLoaded: 662400,
      redeemed: 0,
      availableBalance: 662400,
      observations: 'Carga mensual Febrero',
      date: '2026-02-28T12:00:00Z'
    },
    {
      id: 'default-jhonny-feb',
      userId: '9',
      userName: 'Jhonny Stefanell',
      distributor: 'UNIVERSAL',
      month: 'Febrero',
      gallonsSold: 1247,
      valuePerGallon: 1000,
      amountLoaded: 1247000,
      redeemed: 0,
      availableBalance: 1247000,
      observations: 'Carga mensual Febrero',
      date: '2026-02-28T12:00:00Z'
    },
    {
      id: 'default-gabriel-feb',
      userId: '1',
      userName: 'Gabriel',
      distributor: 'MAQUINAGRO',
      month: 'Febrero',
      gallonsSold: 710,
      valuePerGallon: 600,
      amountLoaded: 426000,
      redeemed: 0,
      availableBalance: 426000,
      observations: 'Carga saldo febrero',
      date: '2026-02-28T12:00:00Z'
    },
    {
      id: 'default-miriam-feb',
      userId: '2',
      userName: 'Miriam',
      distributor: 'MAQUINAGRO',
      month: 'Febrero',
      gallonsSold: 704,
      valuePerGallon: 600,
      amountLoaded: 422400,
      redeemed: 0,
      availableBalance: 422400,
      observations: 'Carga saldo febrero',
      date: '2026-02-28T12:00:00Z'
    },
    {
      id: 'default-vacante-feb',
      userId: '3',
      userName: 'Vacante',
      distributor: 'MAQUINAGRO',
      month: 'Febrero',
      gallonsSold: 91,
      valuePerGallon: 0,
      amountLoaded: 0,
      redeemed: 0,
      availableBalance: 0,
      observations: 'Carga saldo febrero',
      date: '2026-02-28T12:00:00Z'
    },
    {
      id: 'default-gabriel-apr',
      userId: '1',
      userName: 'Gabriel',
      distributor: 'MAQUINAGRO',
      month: 'Abril',
      gallonsSold: 688,
      valuePerGallon: 500,
      amountLoaded: 344000,
      redeemed: 0,
      availableBalance: 344000,
      observations: 'Carga acumulativa Abril',
      date: '2026-04-15T12:00:00Z'
    },
    {
      id: 'default-miriam-apr',
      userId: '2',
      userName: 'Miriam',
      distributor: 'MAQUINAGRO',
      month: 'Abril',
      gallonsSold: 984,
      valuePerGallon: 800,
      amountLoaded: 787200,
      redeemed: 0,
      availableBalance: 787200,
      observations: 'Carga acumulativa Abril',
      date: '2026-04-15T12:00:00Z'
    },
    {
      id: 'default-vacante-apr',
      userId: '3',
      userName: 'Vacante',
      distributor: 'MAQUINAGRO',
      month: 'Abril',
      gallonsSold: 232,
      valuePerGallon: 0,
      amountLoaded: 0,
      redeemed: 0,
      availableBalance: 0,
      observations: 'Carga acumulativa Abril',
      date: '2026-04-15T12:00:00Z'
    },
    {
      id: 'default-luz-piedad-jan',
      userId: 'lc1',
      userName: 'Luz Piedad',
      distributor: 'LUBRICAFE',
      month: 'Enero',
      gallonsSold: 814,
      valuePerGallon: 800,
      amountLoaded: 651200,
      redeemed: 0,
      availableBalance: 651200,
      observations: 'Carga saldo enero',
      date: '2026-01-31T12:00:00Z'
    },
    {
      id: 'default-monica-jan',
      userId: 'lc2',
      userName: 'Mónica',
      distributor: 'LUBRICAFE',
      month: 'Enero',
      gallonsSold: 984,
      valuePerGallon: 900,
      amountLoaded: 885600,
      redeemed: 0,
      availableBalance: 885600,
      observations: 'Carga saldo enero',
      date: '2026-01-31T12:00:00Z'
    },
    {
      id: 'default-melissa-jan',
      userId: 'lc3',
      userName: 'Melissa',
      distributor: 'LUBRICAFE',
      month: 'Enero',
      gallonsSold: 825,
      valuePerGallon: 800,
      amountLoaded: 660000,
      redeemed: 0,
      availableBalance: 660000,
      observations: 'Carga saldo enero',
      date: '2026-01-31T12:00:00Z'
    },
    {
      id: 'default-samuel-jan',
      userId: 'lc4',
      userName: 'Samuel',
      distributor: 'LUBRICAFE',
      month: 'Enero',
      gallonsSold: 1682,
      valuePerGallon: 1000,
      amountLoaded: 1682000,
      redeemed: 0,
      availableBalance: 1682000,
      observations: 'Carga saldo enero',
      date: '2026-01-31T12:00:00Z'
    }
  ];

  const [comprobanteData, setComprobanteData] = useState<{ item: RedeemedItem; user: User; id: string; status: string } | null>(null);

  // Check for session in local storage
  useEffect(() => {
    const savedUsers = localStorage.getItem('gulf_all_users');
    const savedRedeemed = localStorage.getItem('gulf_redeemed');
    let redeemed: RedeemedItem[] = savedRedeemed ? JSON.parse(savedRedeemed) : [];

    // Merge DEFAULT_REDEEMED
    const existingRedemptionIds = new Set(redeemed.map(r => r.id));
    const newDefaultRedeemed = DEFAULT_REDEEMED.filter(r => !existingRedemptionIds.has(r.id));
    if (newDefaultRedeemed.length > 0) {
      redeemed = [...redeemed, ...newDefaultRedeemed];
    }

    const savedMonthlyRecords = localStorage.getItem('gulf_monthly_records');
    let monthlyRecordsFromStorage: MonthlyRecord[] = savedMonthlyRecords ? JSON.parse(savedMonthlyRecords) : [];

    // Merge DEFAULT_RECORDS
    const existingRecordIds = new Set(monthlyRecordsFromStorage.map(r => r.id));
    const newDefaultRecords = DEFAULT_RECORDS.filter(r => !existingRecordIds.has(r.id));
    if (newDefaultRecords.length > 0) {
      monthlyRecordsFromStorage = [...monthlyRecordsFromStorage, ...newDefaultRecords];
    }

    let parsedUsers: User[] = savedUsers ? JSON.parse(savedUsers) : RAW_USERS;

    // Sync RAW_USERS to ensure updates to existing users are reflected
    const rawUsersMap = new Map(RAW_USERS.map(u => [u.email, u]));
    
    parsedUsers = parsedUsers.map(u => {
      const rawUser = rawUsersMap.get(u.email);
      if (rawUser) {
        // If RAW_USERS has different values, it means a manual update was performed
        // We prioritize RAW_USERS for balance and gallons if they changed
        if (u.balance !== rawUser.balance || u.gallons !== rawUser.gallons || JSON.stringify(u.monthlyBalances) !== JSON.stringify(rawUser.monthlyBalances)) {
          return {
            ...u,
            name: rawUser.name,
            distributor: rawUser.distributor,
            gallons: rawUser.gallons,
            balance: rawUser.balance,
            initialGallons: rawUser.initialGallons,
            initialBalance: rawUser.initialBalance,
            monthlyBalances: rawUser.monthlyBalances,
            password: rawUser.password // Also sync password in case it changed
          };
        }
      }
      return u;
    });

    // Add new users from RAW_USERS that are not in parsedUsers
    const existingEmails = new Set(parsedUsers.map(u => u.email));
    const newUsers = RAW_USERS.filter(u => !existingEmails.has(u.email));
    if (newUsers.length > 0) {
      parsedUsers = [...parsedUsers, ...newUsers];
    }

    // Migration: Ensure initialBalance and initialGallons exist
    const migratedUsers = parsedUsers.map(u => {
      if (u.role === 'ADMIN') return u;
      
      const hasInitial = u.initialBalance !== undefined;
      if (!hasInitial) {
        const userRedemptions = redeemed.filter((ri: any) => ri.userEmail === u.email);
        const totalRedeemed = userRedemptions.reduce((sum: number, ri: any) => sum + ri.price, 0);
        
        const userRecords = monthlyRecordsFromStorage.filter(r => r.userId === u.id);
        const totalLoaded = userRecords.reduce((sum, r) => sum + r.amountLoaded, 0);
        const totalGallonsLoaded = userRecords.reduce((sum, r) => sum + r.gallonsSold, 0);

        return {
          ...u,
          initialBalance: u.balance + totalRedeemed - totalLoaded,
          initialGallons: u.gallons - totalGallonsLoaded
        };
      }
      return u;
    });

    setUsers(migratedUsers);
    setRedeemedItems(redeemed);
    setMonthlyRecords(monthlyRecordsFromStorage);

    const savedOrders = localStorage.getItem('gulf_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedUser = localStorage.getItem('gulf_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      
      // VALIDACIÓN SEGURA: Solo admin.gulf puede ser ADMIN
      if (parsedUser.role === 'ADMIN' && parsedUser.email !== 'admin.gulf') {
        localStorage.removeItem('gulf_user');
        setUser(null);
        alert("Acceso no autorizado.");
        return;
      }

      setUser(parsedUser);
      const isCentral = parsedUser.distributor === 'CENTRAL GULF' || parsedUser.distributor === 'GULF CENTRAL' || parsedUser.email === 'admin.gulf';
      if (isCentral) {
        setActiveView('admin');
      } else {
        setActiveView('catalog');
      }
    }
    const savedWishlist = localStorage.getItem('gulf_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gulf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('gulf_redeemed', JSON.stringify(redeemedItems));
  }, [redeemedItems]);

  useEffect(() => {
    localStorage.setItem('gulf_monthly_records', JSON.stringify(monthlyRecords));
  }, [monthlyRecords]);

  useEffect(() => {
    localStorage.setItem('gulf_all_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gulf_orders', JSON.stringify(orders));
  }, [orders]);

  // Update current user balance if users list changes
  useEffect(() => {
    if (user) {
      const updatedUser = users.find(u => u.id === user.id);
      if (updatedUser) {
        if (user.balance !== updatedUser.balance || JSON.stringify(user.monthlyBalances) !== JSON.stringify(updatedUser.monthlyBalances)) {
          const newUser = { ...updatedUser };
          setUser(newUser);
          localStorage.setItem('gulf_user', JSON.stringify(newUser));
        }
      }
    }
  }, [users, user?.id]);

  // Update user balances based on monthly records and redemptions
  useEffect(() => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.role === 'ADMIN' || u.distributor === 'JAIRO SÁNCHEZ' || u.distributor === 'DISTRIBUIDORA LOS LAGOS') return u;
      
      const userRecords = monthlyRecords.filter(r => r.userId === u.id);
      const totalLoaded = userRecords.reduce((sum, r) => sum + r.amountLoaded, 0);
      const userRedemptions = redeemedItems.filter(ri => ri.userEmail === u.email);
      const totalRedeemed = userRedemptions.reduce((sum, ri) => sum + ri.price, 0);
      
      const newBalance = (u.initialBalance || 0) + totalLoaded - totalRedeemed;
      const totalGallons = (u.initialGallons || 0) + userRecords.reduce((sum, r) => sum + r.gallonsSold, 0);

      if (u.balance !== newBalance || u.gallons !== totalGallons) {
        return { ...u, balance: newBalance, gallons: totalGallons };
      }
      return u;
    }));
  }, [monthlyRecords, redeemedItems]);

  const handleAddMonthlyRecord = (record: Omit<MonthlyRecord, 'id' | 'date'>) => {
    const newRecord: MonthlyRecord = {
      ...record,
      id: `REC-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setMonthlyRecords(prev => [...prev, newRecord]);
  };

  const handleUpdateMonthlyRecord = (record: MonthlyRecord) => {
    setMonthlyRecords(prev => prev.map(r => r.id === record.id ? record : r));
  };

  const handleDeleteMonthlyRecord = (recordId: string) => {
    setMonthlyRecords(prev => prev.filter(r => r.id !== recordId));
  };

  const handleCreateOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    
    // Also add to redeemedItems for history consistency
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

    // Send POST request to Google Apps Script for the new order
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzxNgB39TUM9aeCHjMXp4Gb3C87bvdACXDZpRJamQ90QK9Vd3XKZI5p-iREJ8ST0fa9/exec';
    const isTest = order.distributor === 'PRUEBA';
    
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...order,
        isTest: isTest,
        testEmail: isTest ? 'msilva@prolub.com.co' : null,
        type: 'REDENCION_ENTREGA'
      }),
    })
    .then(response => {
      console.log('Order data sent to Google Apps Script', response);
    })
    .catch(error => {
      console.warn('Error sending order data to Google Apps Script:', error);
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleLogin = (loggedUser: User) => {
    // VALIDACIÓN SEGURA: Prevenir que cualquier otro usuario tome el rol de ADMIN
    if (loggedUser.role === 'ADMIN' && loggedUser.email !== 'admin.gulf') {
      alert("Acceso no autorizado.");
      return;
    }

    setUser(loggedUser);
    localStorage.setItem('gulf_user', JSON.stringify(loggedUser));
    const isCentral = loggedUser.distributor === 'CENTRAL GULF' || loggedUser.distributor === 'GULF CENTRAL' || loggedUser.email === 'admin.gulf';
    if (isCentral) {
      setActiveView('admin');
    } else {
      setActiveView('catalog');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('dashboard');
    localStorage.removeItem('gulf_user');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
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

    alert("✅ Tu redención fue enviada al equipo Gulf Gana Más. Se generará tu comprobante en PDF.");

    const redemptionId = `R-${Date.now()}`;
    setComprobanteData({
      item: newRedeemedItem,
      user: user,
      id: redemptionId,
      status: 'SOLICITADO',
    });

    // Send POST request to Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzxNgB39TUM9aeCHjMXp4Gb3C87bvdACXDZpRJamQ90QK9Vd3XKZI5p-iREJ8ST0fa9/exec';
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script as it doesn't return CORS headers
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redemptionId: redemptionId,
        date: newRedeemedItem.date,
        distributor: user.distributor,
        commercial: user.name + (user.distributor === 'PRUEBA' ? ' (PRUEBA)' : ''),
        userEmail: user.email,
        productName: newRedeemedItem.productName,
        category: product.category,
        price: newRedeemedItem.price,
        isTest: user.distributor === 'PRUEBA'
      }),
    })
    .then(response => {
      console.log('Redemption data sent to Google Apps Script', response);
    })
    .catch(error => {
      console.warn('Error sending redemption data to Google Apps Script:', error);
      // Do not break the application if POST fails
    });

    setTimeout(() => {
      window.print();
      setComprobanteData(null); // Clear comprobante data after printing
    }, 500);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isAdmin = user.email === 'admin.gulf';
  const isCentralGulf = user.distributor === 'CENTRAL GULF' || user.distributor === 'GULF CENTRAL' || isAdmin;
  const isTestUser = user.distributor === 'PRUEBA';

  const renderActiveView = () => {
    switch (activeView) {
      case 'admin':
        if (!isCentralGulf) {
          return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <h2 className="text-3xl font-black text-red-600 mb-4 uppercase">ACCESO NO AUTORIZADO</h2>
              <p className="text-slate-500 font-bold mb-8">No tienes permisos para acceder a esta sección.</p>
              <button 
                onClick={() => setActiveView('catalog')}
                className="bg-[#002F6C] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest"
              >
                Volver a Mi Tienda Gulf
              </button>
            </div>
          );
        }
        return <AdminDashboard 
                  users={users} 
                  monthlyRecords={monthlyRecords}
                  orders={orders}
                  onAddMonthlyRecord={handleAddMonthlyRecord}
                  onUpdateMonthlyRecord={handleUpdateMonthlyRecord}
                  onDeleteMonthlyRecord={handleDeleteMonthlyRecord}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                />;
      case 'catalog':
        return <Catalog 
                  user={user} 
                  wishlist={wishlist} 
                  onToggleWishlist={toggleWishlist} 
                  onRedeem={handleRedeem} 
                  onCreateOrder={handleCreateOrder}
                  onBack={isAdmin ? () => setActiveView('admin') : undefined} 
                />;
      case 'redeemed':
        return <Redeemed user={user} orders={orders} onBack={() => setActiveView('catalog')} />;

      case 'wishlist':
        return <Wishlist user={user} wishlist={wishlist} onToggleWishlist={toggleWishlist} onBack={() => setActiveView('catalog')} />;
      case 'dashboard':
        return <Dashboard user={user!} users={users} monthlyRecords={monthlyRecords} onGoToCatalog={() => setActiveView('catalog')} />;
      default:
        return isAdmin ? <AdminDashboard 
                            users={users} 
                            monthlyRecords={monthlyRecords}
                            orders={orders}
                            onAddMonthlyRecord={handleAddMonthlyRecord}
                            onUpdateMonthlyRecord={handleUpdateMonthlyRecord}
                            onDeleteMonthlyRecord={handleDeleteMonthlyRecord}
                            onUpdateOrderStatus={handleUpdateOrderStatus}
                          /> : <Catalog 
                                  user={user!} 
                                  wishlist={wishlist} 
                                  onToggleWishlist={toggleWishlist} 
                                  onCreateOrder={handleCreateOrder}
                                />;
    }
  };

  const isCommercial = user.role === 'COMMERCIAL';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {isTestUser && (
        <div className="bg-red-600 text-white py-2 px-4 text-center font-black uppercase tracking-[0.3em] text-[10px] animate-pulse z-[100]">
          ⚠️ MODO PRUEBA - LOS MOVIMIENTOS NO AFECTAN SALDOS REALES ⚠️
        </div>
      )}
      <div className="w-full racing-stripe-header sticky top-0 z-[60]"></div>
      
      <header className="bg-white border-b border-slate-200 sticky top-2 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col items-center">
          <div className="mb-4">
            <img 
              src="https://i.postimg.cc/SQ0kdm6y/Logo-GULF-2.png" 
              alt="Gulf Logo" 
              style={{ height: '120px', width: 'auto', display: 'block', margin: '0 auto' }}
            />
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
                  <button 
                    onClick={() => setActiveView('admin')} 
                    className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'admin' ? 'bg-[#002F6C] text-white shadow-md' : 'text-slate-400 hover:text-[#002F6C]'}`}
                  >
                    <LayoutDashboard size={12} /> <span className="hidden sm:inline">Admin Central</span>
                  </button>
                  <button 
                    onClick={() => setActiveView('dashboard')} 
                    className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'dashboard' ? 'bg-[#002F6C] text-white shadow-md' : 'text-slate-400 hover:text-[#002F6C]'}`}
                  >
                    <Trophy size={12} /> <span className="hidden sm:inline">Escuderías</span>
                  </button>
                  <button 
                    onClick={() => setActiveView('catalog')} 
                    className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'catalog' ? 'bg-[#002F6C] text-white shadow-md' : 'text-slate-400 hover:text-[#002F6C]'}`}
                  >
                    <ShoppingBag size={12} /> <span className="hidden sm:inline">Catálogo</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => setActiveView('dashboard')} 
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 ${activeView === 'dashboard' ? 'bg-[#002F6C] text-white shadow-lg' : 'text-slate-400 hover:text-[#002F6C]'}`}
                  >
                    <LayoutDashboard size={12} /> Mi Panel
                  </button>
                   <button 
                    onClick={() => setActiveView('catalog')} 
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeView === 'catalog' ? 'bg-[#002F6C] text-white shadow-lg' : 'text-slate-400 hover:text-[#002F6C]'}`}
                  >
                    Tienda
                  </button>
                   <button 
                    onClick={() => setActiveView('wishlist')} 
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 ${activeView === 'wishlist' ? 'bg-[#FF6A00] text-white shadow-lg' : 'text-slate-400 hover:text-[#FF6A00]'}`}
                  >
                    <Heart size={12} fill={activeView === 'wishlist' ? "white" : "none"} /> Mis Guardados
                  </button>
                  <button 
                    onClick={() => setActiveView('redeemed')} 
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 ${activeView === 'redeemed' ? 'bg-[#002F6C] text-white shadow-lg' : 'text-slate-400 hover:text-[#002F6C]'}`}
                  >
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
              
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest transition-all hover:shadow-lg active:scale-95"
              >
                SALIR
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* Print Area for Comprobante */}
      {comprobanteData && (
        <div id="comprobante-print-area" className="fixed top-0 left-0 w-full h-full bg-white z-[9999] hidden print:block">
          <RedemptionComprobante item={comprobanteData.item} user={comprobanteData.user} id={comprobanteData.id} />
        </div>
      )}

      <footer className="bg-white py-10 text-center border-t border-slate-100 mt-12">
        <div className="container mx-auto px-4">
          <img 
            src="https://i.postimg.cc/SQ0kdm6y/Logo-GULF-2.png" 
            alt="Gulf Logo" 
            style={{ height: '60px', width: 'auto', display: 'block', margin: '0 auto', opacity: 0.2 }}
            className="grayscale mb-4"
          />
          <p className="text-[10px] font-black text-[#002F6C] uppercase tracking-[0.4em] opacity-30 mb-2">
            &copy; {new Date().getFullYear()} GULF Lubricantes - Programa de Incentivos "Vender GULF sí paga"
          </p>
          <p className="text-[9px] text-slate-400 italic">Las imágenes de los productos son de referencia.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
