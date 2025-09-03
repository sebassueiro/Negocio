import { useState } from 'react';
import { ResumenCigarrillo } from "./../../consultas/consultas";

function ResumenCigarrillos() {
  const [resumen, setResumen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const obtenerFechaLocal = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleGenerarTotal = async () => {
    setLoading(true);
    try {
      const fechaFormateada = obtenerFechaLocal();
      const data = await ResumenCigarrillo(fechaFormateada);
      setResumen(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener el resumen de cigarrillos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatoARS = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(valor);
  };

  return (
    <div className="p-6 flex flex-col items-center justify-start min-h-screen mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🚬 Resumen de Cigarrillos - {fechaHoy}
      </h2>
      <button
        onClick={handleGenerarTotal}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generando..." : "Generar Resumen"}
      </button>

      {showModal && resumen && (
        <div className="fixed inset-0 z-50 bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px] text-center pointer-events-auto">
            <h2 className="text-lg font-bold mb-4">
              Detalle de Cigarrillos
            </h2>

<div className="overflow-x-auto mb-4">
  <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
    <thead className="bg-gray-200 text-gray-700">
      <tr>
        <th className="px-4 py-2 border">Producto</th>
        <th className="px-4 py-2 border text-right">Cantidad</th>
        <th className="px-4 py-2 border text-right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {resumen.detalles.map((item, idx) => (
        <tr
          key={idx}
          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
        >
          <td className="px-4 py-2 border">{item.nombre}</td>
          <td className="px-4 py-2 border text-right">{item.cantidad}</td>
          <td className="px-4 py-2 border text-right">{formatoARS(item.total)}</td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr className="bg-gray-200 font-semibold">
        <td className="px-4 py-2 border text-right" colSpan={2}>
          Total
        </td>
        <td className="px-4 py-2 border text-right">
          {formatoARS(resumen.totalCigarrillos)}
        </td>
      </tr>
    </tfoot>
  </table>
</div>


            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumenCigarrillos;
