import { useEffect, useState } from 'react';
import { ResumenMensual } from '../../consultas/consultas';

function ResumenMensualCard() {
  const [resumenes, setResumenes] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatoARS = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const nombreMes = (mes) => {
    return new Date(2025, mes - 1).toLocaleString('es-AR', { month: 'long' });
  };

  useEffect(() => {
    const cargarResumenes = async () => {
      setLoading(true);
      try {
        const meses = Array.from({ length: 12 }, (_, i) => i + 1);
        const promesas = meses.map((mes) => ResumenMensual(mes));
        const resultados = await Promise.all(promesas);
        setResumenes(resultados);
      } catch (error) {
        console.error("Error al cargar los resúmenes mensuales:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarResumenes();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center justify-start min-h-screen mt-10">
      <h2 className="text-4xl font-bold mb-6 text-center">📊 Resúmenes Mensuales</h2>

      {loading ? (
        <p className="text-gray-500">Cargando resúmenes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {resumenes.map((resumen) => (
            <div
              key={`${resumen.anio}-${resumen.mes}`}
              className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
            >
              <h3 className="text-xl text-center font-semibold mb-2 text-black-700">
                {nombreMes(resumen.mes)} {resumen.anio}
              </h3>
              <div className="text-left space-y-1">
                <p><strong>Ingresos:</strong> {formatoARS(resumen.ingresos)}</p>
                <p><strong>Egresos:</strong> {formatoARS(resumen.egresos)}</p>
                <p><strong>Ganancia Neta:</strong> {formatoARS(resumen.gananciaNeta)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumenMensualCard;
