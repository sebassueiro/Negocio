import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import ProductsPage from './components/productsPage/ProductsPage';
import MainPage from './components/mainPage/MainPage';

function App() {
  return (
    <Router>
      <Header title="Lo de Osvaldo" />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mainpage" element={<MainPage/>} />
        <Route path="/ProductsPage" element={<ProductsPage/>} />
      </Routes>
    </Router>
  );  
}

export default App;
