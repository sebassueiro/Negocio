import React, { useState, useEffect } from "react";
import UpdateProduct from "../updateProduct/UpdateProduct";
import { toast } from "react-toastify";
import { buscarProductoPorNombre } from "../../consultas/consultas"; // importa tu función

function ListProducts({ productos, buscarProducto, verTodos, handleUpdate, abrirModal }) {
  const [open, setOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState(""); // nuevo estado
  const [productosFiltrados, setProductosFiltrados] = useState(productos);

  const handleEdit = (producto) => {
    setProductoSeleccionado(producto);
    setOpen(true);
  };

  const handleSave = async (codigoBarra, nuevoPrecio) => {
    await handleUpdate(codigoBarra, nuevoPrecio);
    setOpen(false);
    setProductoSeleccionado(null);
  };

  const handleBuscar = () => {
    buscarProducto(codigo);
    setCodigo("");
  };

  const formatoARS = (valor) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2
    }).format(valor);
  };

  // 🔎 Filtrado por nombre en vivo
  useEffect(() => {
    const fetchByName = async () => {
      if (nombre.trim() === "") {
        setProductosFiltrados(productos);
        return;
      }
      try {
        const data = await buscarProductoPorNombre(nombre);
        setProductosFiltrados(data);
      } catch (error) {
        console.error("Error al buscar por nombre:", error);
        toast.error("Error al buscar productos por nombre ❌");
      }
    };

    const delayDebounce = setTimeout(fetchByName, 400); // debounce 400ms
    return () => clearTimeout(delayDebounce);
  }, [nombre, productos]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl">
        {/* Barra de búsqueda y acciones */}
<div className="flex mb-4 gap-2">
  <input
    id="barcode-input"
    type="text"
    placeholder="Código de barra"
    className="flex-1 p-2 border rounded-md focus:outline-none"
    value={codigo}
    onChange={(e) => setCodigo(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
    autoFocus
  />
  <input
    type="text"
    placeholder="Buscar por nombre"
    className="flex-1 p-2 border rounded-md focus:outline-none"
    value={nombre}
    onChange={(e) => setNombre(e.target.value)}
  />
  <button
    onClick={handleBuscar}
    className="bg-slate-600 text-white px-4 rounded hover:bg-slate-800"
  >
    Buscar
  </button>
  <button
    onClick={verTodos}
    className="bg-slate-600 text-white px-4 rounded hover:bg-slate-800"
  >
    Ver todos
  </button>
  <button
    className="bg-slate-600 text-white px-4 rounded hover:bg-slate-800"
    onClick={abrirModal}
  >
    Crear producto
  </button>
</div>


        {/* Tabla de productos con encabezado fijo y scroll */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="max-h-[750px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-semibold">Código de Barra</th>
                  <th className="p-3 font-semibold">Nombre</th>
                  <th className="p-3 font-semibold text-right">Precio</th>
                  <th className="p-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((prod, idx) => (
                  <tr
                    key={prod.codigoBarra ?? prod.codigo}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50 transition`}
                  >
                    <td className="p-3">{prod.codigoBarra ?? prod.codigo}</td>
                    <td className="p-3">{prod.nombre}</td>
                    <td className="p-3 text-right">
                      {formatoARS(prod.precioVenta ?? prod.precio)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(prod)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {productosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">
                      No hay productos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para editar producto */}
      <UpdateProduct
        open={open}
        onClose={() => setOpen(false)}
        producto={productoSeleccionado}
        onSave={handleSave}
      />
    </div>
  );
}

export default ListProducts;
