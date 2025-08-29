import React, { useState, useEffect } from "react";

function UpdateProduct({ open, onClose, producto, onSave }) {
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (producto) {
      setPrecio(producto.precioVenta ?? producto.precio ?? "");
      setError("");
    }
  }, [producto]);

  if (!open || !producto) return null;

  const handleSave = () => {
    if (!precio || isNaN(precio) || Number(precio) <= 0) {
      setError("El precio debe ser un número mayor a 0");
      return;
    }
    onSave(producto.codigoBarra ?? producto.codigo, Number(precio));
  };

  return (
    <div className="fixed inset-0 z-50 bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Actualizar producto</h2>

        <div className="mb-2">
          <div>
            <span className="font-semibold">Código de barra:</span>{" "}
            {producto.codigoBarra ?? producto.codigo}
          </div>
          <div>
            <span className="font-semibold">Nombre:</span> {producto.nombre}
          </div>
        </div>

        <input
          type="number"
          className="w-full p-2 border rounded mb-2"
          placeholder="Nuevo precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;