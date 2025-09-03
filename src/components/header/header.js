// src/components/Header.jsx
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import Logo from '../../logo/Logo Negocio.jpeg';

export default function Header({ title = "Lo de Osvaldo" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        {/* Logo + Nombre */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full object-cover"/>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>

        {/* Botón Menú */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-gray-400 transition-colors"
        >
          <GiHamburgerMenu className="w-6 h-6 text-gray-800" />
        </button>
      </header>

      {/* OVERLAY (fondo oscuro) */}
      {isOpen && (
        <div
        
          className="fixed inset-0 bg-opacity-10 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MENÚ LATERAL */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-gray-800">Menú</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Opciones */}
        <nav className="flex flex-col p-4 space-y-4">
          <Link
            to="/mainpage"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Caja
          </Link>
          <Link
            to="/ProductsPage"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Productos
          </Link>
          <Link
            to="/ArqueoCaja"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Arqueo de Caja
          </Link>
          <Link
            to="/ResumenMensual"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Resumen Mensual
          </Link>
          <Link
            to="/ResumenCigarrillos"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Resumen Cigarrillos
          </Link>
          <Link
            to="/Empleado"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Empleados
          </Link>
        </nav>
      </div>
    </>
  );
}
