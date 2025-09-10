import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import ProductsPage from './components/productsPage/ProductsPage';
import ArqueoCaja from './components/arqueoCaja/ArqueoCaja';
import MainPage from './components/mainPage/MainPage';
import ResumenMensual from './components/resumenMensualCard/ResumenMensualCard';
import ResumenCigarrillos from './components/resumenCigarrilos/ResumenCigarrillos';
import Empleado from './components/empleado/Empleado';
import Proveedores from './components/proveedor/Proveedor';
import Clientes from './components/clientes/Clientes';
import  Ticket  from "./components/venta/VentasHoy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
      <Header title="Lo de Osvaldo" />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mainpage" element={<MainPage/>} />
        <Route path="/ProductsPage" element={<ProductsPage/>} />
        <Route path="/ArqueoCaja" element={<ArqueoCaja/>} />
        <Route path="/ResumenMensual" element={<ResumenMensual/>} />
        <Route path="/ResumenCigarrillos" element={<ResumenCigarrillos />} />
        <Route path="/Empleado" element={<Empleado />} />
        <Route path="/Proveedores" element={<Proveedores />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="Ticket" element={<Ticket />} />
      </Routes>

      {/* Contenedor global de Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </Router>
  );  
}

export default App;
