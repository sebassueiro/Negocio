import React, { useState } from "react";
import UpdateProduct from "../updateProduct/UpdateProduct";

function ListProducts({ productos, buscarProducto, verTodos, handleUpdate }) {
  const [open, setOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [codigo, setCodigo] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl">
        {/* Barra de búsqueda y acciones */}
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Código de barra"
            className="flex-1 p-2 border rounded-l-md focus:outline-none"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          />
          <button
            onClick={handleBuscar}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
          <button
            onClick={verTodos}
            className="bg-gray-300 text-gray-800 px-4 rounded hover:bg-gray-400"
          >
            Ver todos
          </button>
          <button
            className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
            // onClick={...} // Aquí puedes abrir un modal para agregar producto nuevo
          >
            Agregar nuevo producto
          </button>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 font-semibold">Código de Barra</th>
                <th className="p-3 font-semibold">Nombre</th>
                <th className="p-3 font-semibold text-right">Precio</th>
                <th className="p-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod, idx) => (
                <tr
                  key={prod.codigoBarra ?? prod.codigo}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-green-50 transition`}
                >
                  <td className="p-3">{prod.codigoBarra ?? prod.codigo}</td>
                  <td className="p-3">{prod.nombre}</td>
                  <td className="p-3 text-right">
                    ${prod.precioVenta ?? prod.precio}
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
              {productos.length === 0 && (
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
