import React, { useState, useEffect } from "react";

function UpdateProduct({ open, onClose, producto, onSave }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre ?? "");
      setPrecio(producto.precioVenta ?? producto.precio ?? "");
      setError("");
    }
  }, [producto]);

  // Manejo del Enter
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, precio, nombre]);

  if (!open || !producto) return null;

  const handleSave = () => {
    if (!precio || isNaN(precio) || Number(precio) <= 0) {
      setError("El precio debe ser un número mayor a 0");
      return;
    }
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }

    onSave(producto.codigoBarra ?? producto.codigo, {
      nombre,
      precioVenta: Number(precio),
    });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      const barcodeInput = document.getElementById("barcode-input");
      if (barcodeInput) barcodeInput.focus();
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Actualizar producto</h2>

        <div className="mb-4">
          <div>
            <span className="font-semibold">Código de barra:</span>{" "}
            {producto.codigoBarra ?? producto.codigo}
          </div>
        </div>

        <div className="flex items-center mb-3">
          <label className="w-24 font-semibold">Nombre:</label>
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="flex items-center mb-3">
          <label className="w-24 font-semibold">Precio:</label>
          <input
            type="number"
            className="flex-1 p-2 border rounded"
            placeholder="Nuevo precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
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
