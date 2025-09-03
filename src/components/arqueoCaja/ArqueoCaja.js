import { useState } from 'react';
import { ResumenDiario } from "./../../consultas/consultas";

function ArqueoCaja() {
  const [resumen, setResumen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fecha para mostrar en el título (formato largo, local)
  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Función para obtener fecha local en formato YYYY-MM-DD
  const obtenerFechaLocal = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleGenerarArqueo = async () => {
    setLoading(true);
    try {
      const fechaFormateada = obtenerFechaLocal();
      const data = await ResumenDiario(fechaFormateada);
      setResumen(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener el resumen diario:", error);
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

  // Formatear la fecha del resumen sin desfase horario
  const formatearFechaResumen = (fechaISO) => {
    const [anio, mes, dia] = fechaISO.split("T")[0].split("-");
    const fecha = new Date(`${anio}-${mes}-${dia}T12:00:00`);
    return fecha.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="p-6 flex flex-col items-center justify-start min-h-screen mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🧾 Arqueo de Caja - {fechaHoy}
      </h2>
      <button
        onClick={handleGenerarArqueo}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generando..." : "Generar Arqueo"}
      </button>

      {showModal && resumen && (
        <div className="fixed inset-0 z-50 bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px] text-center pointer-events-auto">
            <h2 className="text-lg font-bold mb-4">
               {formatearFechaResumen(resumen.fecha)}
            </h2>

            <div className="text-left mb-4">
              <p><strong>Ingresos:</strong> {formatoARS(resumen.ingresos)}</p>
              <p><strong>Egresos:</strong> {formatoARS(resumen.egresos)}</p>
              <p><strong>Ganancia Neta:</strong> {formatoARS(resumen.gananciaNeta)}</p>
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

export default ArqueoCaja;
