import React, { useState } from "react";

function CreateProduct({ open, onClose, onSave }) {
  const [codigoBarra, setCodigoBarra] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [esCigarrillo, setEsCigarrillo] = useState(false);
  const [esPrecioVariable, setEsPrecioVariable] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSave = () => {
    if (!codigoBarra || !nombre || !precio) {
      setError("Código, nombre y precio son obligatorios");
      return;
    }
    if (isNaN(precio) || Number(precio) <= 0) {
      setError("El precio debe ser un número mayor a 0");
      return;
    }

    const nuevoProducto = {
      codigoBarra,
      nombre,
      descripcion,
      precioVenta: Number(precio),
      esCigarrillo,
      esPrecioVariable, 
    };

    onSave(nuevoProducto);
    // limpiar y cerrar
    setCodigoBarra("");
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setEsCigarrillo(false);
    setEsPrecioVariable(false);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Crear producto</h2>

        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Código de barra"
          value={codigoBarra}
          onChange={(e) => setCodigoBarra(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="decimal"
          className="w-full p-2 border rounded mb-2"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="cigarrillo"
            checked={esCigarrillo}
            onChange={(e) => setEsCigarrillo(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="cigarrillo">¿Es cigarrillo?</label>
          <input
            type="checkbox"
            id="precioVariable"
            checked={esPrecioVariable}
            onChange={(e) => setEsPrecioVariable(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="precioVariable">¿Es precio variable?</label>
        </div>

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
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
