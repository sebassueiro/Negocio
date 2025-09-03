import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import ProductsPage from './components/productsPage/ProductsPage';
import ArqueoCaja from './components/arqueoCaja/ArqueoCaja';
import MainPage from './components/mainPage/MainPage';
import ResumenMensual from './components/resumenMensualCard/ResumenMensualCard';
import ResumenCigarrillos from './components/resumenCigarrilos/ResumenCigarrillos';

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
      </Routes>
    </Router>
  );  
}

export default App;
