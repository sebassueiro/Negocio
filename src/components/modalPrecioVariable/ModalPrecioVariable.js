import React, { useEffect, useState } from "react";

function ModalPrecioVariable({ producto, peso, setPeso, onConfirm, onClose }) {
  const [precioFinal, setPrecioFinal] = useState(null);

  const redondearMultiplo50 = (valor) => Math.round(valor / 50) * 50;

  useEffect(() => {
    if (!producto) {
      setPrecioFinal(null);
      return;
    }

    const gramos = parseFloat(peso);
    if (isNaN(gramos) || gramos <= 0) {
      setPrecioFinal(null);
      return;
    }

    const precioKilo = Number(producto.precioVenta ?? producto.precio_venta ?? producto.precio ?? 0);
    if (!precioKilo || isNaN(precioKilo)) {
      setPrecioFinal(null);
      return;
    }

    const precio = (precioKilo * gramos) / 1000;
    setPrecioFinal(redondearMultiplo50(precio));
  }, [peso, producto]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (precioFinal !== null) onConfirm(precioFinal);
    } else if (e.key === "Escape") {
      setPeso("");
      onClose();
    }
  };

  if (!producto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px] text-center pointer-events-auto">
        <h2 className="text-lg font-bold mb-4">Ingresar peso para {producto.nombre}</h2>

        <input
          type="number"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Peso en gramos"
          className="border p-2 rounded w-full mb-4"
          autoFocus
        />

        {precioFinal === null ? (
          <p className="mb-4 text-sm text-gray-500">Ingresa un peso válido y revisa el precio del producto.</p>
        ) : (
          <p className="mb-4 font-semibold">Precio calculado: ${precioFinal}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setPeso("");
              onClose();
            }}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => precioFinal !== null && onConfirm(precioFinal)}
            disabled={precioFinal === null}
            className={`px-4 py-2 rounded text-white ${
              precioFinal === null ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPrecioVariable;
