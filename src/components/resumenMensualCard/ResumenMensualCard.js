import { useEffect, useState } from "react";
import { ResumenMensual } from "../../consultas/consultas";
import { toast } from "react-toastify";

function ResumenMensualTabla() {
  const [resumenes, setResumenes] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatoARS = (valor) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(valor);
  };

  const nombreMes = (mes) => {
    return new Date(new Date().getFullYear(), mes - 1).toLocaleString("es-AR", { month: "long" });
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
    <div className="mt-3 w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">📊 Resúmenes Mensuales</h2>

      {loading ? (
        <p className="text-gray-500">Cargando resúmenes...</p>
      ) : (
        // contenedor con borde exterior más grueso
        <div className="w-full max-w-6xl shadow-md rounded-xl border-2 border-gray-300 overflow-hidden">
          {/* contenedor con scroll interno y altura máxima calculada */}
          <div className="overflow-auto max-h-[calc(100vh-150px)]">
            {/* Tabla con borde exterior y líneas horizontales internas más visibles */}
            <table className="w-full min-w-[800px] border-collapse bg-white text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-left border-b-2 border-gray-300">Mes</th>
                  <th className="p-2 text-right border-b-2 border-gray-300">Ingresos</th>
                  <th className="p-2 text-right border-b-2 border-gray-300">Egresos Sueldos</th>
                  <th className="p-2 text-right border-b-2 border-gray-300">Egresos Compras</th>
                  <th className="p-2 text-right border-b-2 border-gray-300">Egresos Totales</th>
                  <th className="p-2 text-right border-b-2 border-gray-300">Ganancia Neta</th>
                </tr>
              </thead>
              <tbody>
                {resumenes.map((resumen, index) => (
                  <tr
                    key={`${resumen.anio}-${resumen.mes}`}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-2 font-semibold border-b border-gray-200">{nombreMes(resumen.mes)} {resumen.anio}</td>
                    <td className="p-2 text-right text-green-600 border-b border-gray-200">{formatoARS(resumen.ingresos)}</td>
                    <td className="p-2 text-right text-red-600 border-b border-gray-200">{formatoARS(resumen.egresosSueldos)}</td>
                    <td className="p-2 text-right text-red-600 border-b border-gray-200">{formatoARS(resumen.egresosCompras)}</td>
                    <td className="p-2 text-right border-b border-gray-200">{formatoARS(resumen.egresos)}</td>
                    <td
                      className={`p-2 text-right font-bold border-b border-gray-200 ${
                        resumen.gananciaNeta >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatoARS(resumen.gananciaNeta)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumenMensualTabla;
