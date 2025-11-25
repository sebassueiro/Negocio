import React, { useEffect, useRef } from "react";

function ModalPrecioVariable({ producto, precio, setPrecio, onConfirm, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!producto) return;

    // foco al abrir; no seleccionamos para no perder el caret mientras tipeás
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // dependemos sólo de `producto` para que no re-ejecute en cada render del padre
  }, [producto, onConfirm, onClose]);

  if (!producto) return null;

  // Normalizador: permite dígitos y un separador decimal (punto o coma)
  const handleChange = (e) => {
    const raw = e.target.value;
    // reemplaza comas por punto, deja solo dígitos y un punto decimal
    const normalized = raw.replace(",", ".").replace(/[^0-9.]/g, "");
    // permite sólo un punto
    const parts = normalized.split(".");
    const value =
      parts.length <= 1 ? parts[0] : parts.shift() + "." + parts.join("");
    setPrecio(value);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px] text-center pointer-events-auto">
        <h2 className="text-lg font-bold mb-4">
          Ingresar precio para {producto.nombre}
        </h2>

        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={precio}
          onChange={handleChange}
          placeholder="Precio"
          className="border p-2 rounded w-full mb-4"
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

