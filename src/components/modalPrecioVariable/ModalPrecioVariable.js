import React from 'react';

function ModalPrecioVariable({ producto, precio, setPrecio, onConfirm, onClose }) {
  if (!producto) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onConfirm();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0} // necesario para capturar eventos de teclado
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px] text-center pointer-events-auto">
        <h2 className="text-lg font-bold mb-4">
          Ingresar precio para {producto.nombre}
        </h2>

        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          className="border p-2 rounded w-full mb-4"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPrecioVariable;
