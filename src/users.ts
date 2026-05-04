import { User } from './types';

export const RAW_USERS: User[] = [
  // MAQUINAGRO
  { id: '1', name: 'Gabriel', email: 'gabriel@maquinagro', password: 'GulfMG01', distributor: 'MAQUINAGRO', gallons: 2242, initialGallons: 844, balance: 1445200, initialBalance: 675200, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 675200, 'Febrero': 426000, 'Abril': 344000 } },
  { id: '2', name: 'Miriam', email: 'miriam@maquinagro', password: 'GulfMG02', distributor: 'MAQUINAGRO', gallons: 2649, initialGallons: 961, balance: 1978400, initialBalance: 768800, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 768800, 'Febrero': 422400, 'Abril': 787200 } },
  { id: '3', name: 'Vacante', email: 'vacante@maquinagro', password: 'GulfMG03', distributor: 'MAQUINAGRO', gallons: 492, initialGallons: 169, balance: 0, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: { 'Febrero': 0, 'Abril': 0 } },
  
  // JAIRO SÁNCHEZ
  { id: '4', name: 'Jhon Jainer', email: 'jhon.jainer@jairosanchez', password: 'GulfJS01', distributor: 'JAIRO SÁNCHEZ', gallons: 2233, initialGallons: 2233, balance: 1339800, initialBalance: 1339800, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: '5', name: 'George Hagi', email: 'george.hagi@jairosanchez', password: 'GulfJS02', distributor: 'JAIRO SÁNCHEZ', gallons: 2693, initialGallons: 2693, balance: 2154400, initialBalance: 2154400, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: '6', name: 'Jaider', email: 'jaider@jairosanchez', password: 'GulfJS03', distributor: 'JAIRO SÁNCHEZ', gallons: 1647, initialGallons: 1647, balance: 823500, initialBalance: 823500, role: 'COMMERCIAL', monthlyBalances: {} },
  
  // UNIVERSAL
  { id: '7', name: 'Giovanni Del Duca', email: 'giovanni@universal', password: 'GulfUN01', distributor: 'UNIVERSAL', gallons: 1237, initialGallons: 409, balance: 662400, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: { 'Febrero': 662400 } },
  { id: '8', name: 'Zaid Murgas', email: 'zaid@universal', password: 'GulfUN02', distributor: 'UNIVERSAL', gallons: 852, initialGallons: 852, balance: 681600, initialBalance: 681600, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 681600 } },
  { id: '9', name: 'Jhonny Stefanell', email: 'jhonny@universal', password: 'GulfUN03', distributor: 'UNIVERSAL', gallons: 2361, initialGallons: 1114, balance: 2361000, initialBalance: 1114000, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 1114000, 'Febrero': 1247000 } },
  { id: '10', name: 'Yerli Martinez', email: 'jeimy@universal', password: 'GulfUN04', distributor: 'UNIVERSAL', gallons: 206, initialGallons: 206, balance: 0, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: 'un5', name: 'YERLIN MOLINA', email: 'yerlin@universal', password: 'gulf12', distributor: 'UNIVERSAL', gallons: 806, initialGallons: 806, balance: 644800, initialBalance: 644800, role: 'COMMERCIAL', monthlyBalances: { 'Abril': 644800 } },
  
  // LOS LAGOS
  { id: '11', name: 'Milton', email: 'milton@loslagos', password: 'GulfLL01', distributor: 'DISTRIBUIDORA LOS LAGOS', gallons: 1600, initialGallons: 1600, balance: 614000, initialBalance: 614000, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: '12', name: 'Silvia', email: 'silvia@loslagos', password: 'GulfLL02', distributor: 'DISTRIBUIDORA LOS LAGOS', gallons: 1332, initialGallons: 1332, balance: 522000, initialBalance: 522000, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: '13', name: 'Alvaro', email: 'alvaro@loslagos', password: 'GulfLL03', distributor: 'DISTRIBUIDORA LOS LAGOS', gallons: 2278, initialGallons: 2278, balance: 1663700, initialBalance: 1663700, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: '14', name: 'Dayana', email: 'dayana@loslagos', password: 'GulfLL04', distributor: 'DISTRIBUIDORA LOS LAGOS', gallons: 1771, initialGallons: 1771, balance: 958400, initialBalance: 958400, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: '15', name: 'Almacen', email: 'almacen@loslagos', password: 'GulfLL05', distributor: 'DISTRIBUIDORA LOS LAGOS', gallons: 1674, initialGallons: 1674, balance: 837000, initialBalance: 837000, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: '17', name: 'Luis', email: 'luis@loslagos', password: 'GulfLL06', distributor: 'DISTRIBUIDORA LOS LAGOS', gallons: 6088, initialGallons: 6088, balance: 1826400, initialBalance: 1826400, role: 'COMMERCIAL', monthlyBalances: {} },
 
  // LUBRICAFE
  { id: 'lc1', name: 'Luz Piedad', email: 'luz.piedad@lubricafe', password: 'GulfLC01', distributor: 'LUBRICAFE', gallons: 1699, initialGallons: 885, balance: 1359200, initialBalance: 708000, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 1359200 } },
  { id: 'lc2', name: 'Mónica', email: 'monica@lubricafe', password: 'GulfLC02', distributor: 'LUBRICAFE', gallons: 1325, initialGallons: 341, balance: 885600, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 885600 } },
  { id: 'lc3', name: 'Melissa', email: 'melissa@lubricafe', password: 'GulfLC03', distributor: 'LUBRICAFE', gallons: 1268, initialGallons: 443, balance: 660000, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 660000 } },
  { id: 'lc4', name: 'Samuel', email: 'samuel@lubricafe', password: 'GulfLC04', distributor: 'LUBRICAFE', gallons: 3493, initialGallons: 1811, balance: 2643000, initialBalance: 1811000, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 3493000 } },

  // GRUPO MOTOR
  { id: 'gm1', name: 'DARWIN SAID CASTRO FLOREZ', email: 'darwin.grupomotor', password: 'gulf1', distributor: 'GRUPO MOTOR', gallons: 56, initialGallons: 56, balance: 0, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: {} },
  { id: 'gm2', name: 'OSCAR JAVIER GARCIA DIAZ', email: 'oscar.grupomotor', password: 'gulf2', distributor: 'GRUPO MOTOR', gallons: 1520, initialGallons: 1520, balance: 1520000, initialBalance: 1520000, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 1520000 } },

  // RAMOS DISTRIBUCIONES
  { id: 'rd1', name: 'ALEXANDER LABRADA', email: 'alexander.ramos', password: 'gulf1', distributor: 'RAMOS DISTRIBUCIONES', gallons: 1169, initialGallons: 1169, balance: 661800, initialBalance: 661800, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 351700, 'Abril': 310100 } },
  { id: 'rd2', name: 'SANTIAGO RAMOS', email: 'santiago.ramos', password: 'gulf2', distributor: 'RAMOS DISTRIBUCIONES', gallons: 1279, initialGallons: 1279, balance: 807200, initialBalance: 807200, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 120000, 'Abril': 687200 } },
  { id: 'rd3', name: 'EDWIN GAÑÁN', email: 'edwin.ramos', password: 'gulf1', distributor: 'RAMOS DISTRIBUCIONES', gallons: 176, initialGallons: 176, balance: 63600, initialBalance: 63600, role: 'COMMERCIAL', monthlyBalances: { 'Abril': 63600 } },
  { id: 'rd4', name: 'JUAN DAVID RAMOS', email: 'juandavid.ramos', password: 'gulf2', distributor: 'RAMOS DISTRIBUCIONES', gallons: 3895, initialGallons: 3895, balance: 1947500, initialBalance: 1947500, role: 'COMMERCIAL', monthlyBalances: { 'Abril': 1947500 } },
  { id: 'rd5', name: 'MAURICIO QUICENO', email: 'mauricio.ramos', password: 'gulf3', distributor: 'RAMOS DISTRIBUCIONES', gallons: 300, initialGallons: 300, balance: 180000, initialBalance: 180000, role: 'COMMERCIAL', monthlyBalances: { 'Abril': 180000 } },
  { id: 'rd6', name: 'JUAN CAMILO GOMEZ', email: 'juancamilo.ramos', password: 'gulf4', distributor: 'RAMOS DISTRIBUCIONES', gallons: 50, initialGallons: 50, balance: 0, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: { 'Abril': 0 } },
  { id: 'rd7', name: 'JORGE MARIN', email: 'jorge.ramos', password: 'gulf5', distributor: 'RAMOS DISTRIBUCIONES', gallons: 101, initialGallons: 101, balance: 60600, initialBalance: 60600, role: 'COMMERCIAL', monthlyBalances: { 'Abril': 60600 } },
  { id: 'rd8', name: 'LUIS ORREGO', email: 'luis.ramos', password: 'gulf6', distributor: 'RAMOS DISTRIBUCIONES', gallons: 78, initialGallons: 78, balance: 0, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: { 'Abril': 0 } },

  // ADMINISTRADOR MENSUAL (ACCESO EXCLUSIVO PRUEBAS)
  { id: 'admin-mensual', name: 'ADMINISTRADOR MENSUAL', email: 'admin.mensual@gulf', password: '0000', distributor: 'CENTRAL GULF', gallons: 0, initialGallons: 0, balance: 6000000, initialBalance: 6000000, role: 'COMMERCIAL', monthlyBalances: { 'Enero': 6000000 } },

  // ADMIN CENTRAL
  { id: 'admin', name: 'Admin Gulf', email: 'admin.gulf', password: 'AdminGulf2026', distributor: 'GULF CENTRAL', gallons: 0, initialGallons: 0, balance: 0, initialBalance: 0, role: 'ADMIN' },

  // USUARIO DE PRUEBA
  { id: 'test-user', name: 'USUARIO TEST', email: 'msilva@prolub.com.co', password: '0000', distributor: 'PRUEBA', gallons: 0, initialGallons: 0, balance: 9999999, initialBalance: 9999999, role: 'COMMERCIAL', monthlyBalances: {} },

  // CVC SERVITECAS
{ id: 'sv1', name: 'César Cruz', email: 'cesar@servitecas', password: 'GulfSV01', distributor: 'CVC SERVITECAS', gallons: 1264, initialGallons: 341, balance: 0, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: {} },
{ id: 'sv2', name: 'Miguel Vargas', email: 'miguel@servitecas', password: 'GulfSV02', distributor: 'CVC SERVITECAS', gallons: 3541, initialGallons: 1281, balance: 2832800, initialBalance: 1024800, role: 'COMMERCIAL', monthlyBalances: {} },
{ id: 'sv3', name: 'Cesar Moreno', email: 'cesar.moreno@servitecas', password: 'GulfSV03', distributor: 'CVC SERVITECAS', gallons: 64, initialGallons: 32, balance: 0, initialBalance: 0, role: 'COMMERCIAL', monthlyBalances: {} },
];
