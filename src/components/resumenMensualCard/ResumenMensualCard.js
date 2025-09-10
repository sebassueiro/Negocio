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
    return new Date(2025, mes - 1).toLocaleString("es-AR", { month: "long" });
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
    <div className="p-6 mt-10 w-full flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-6 text-center">📊 Resúmenes Mensuales</h2>

      {loading ? (
        <p className="text-gray-500">Cargando resúmenes...</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-6xl shadow-md rounded-xl border">
          <table className="w-full border-collapse bg-white rounded-xl">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Mes</th>
                <th className="p-3 text-right">Ingresos</th>
                <th className="p-3 text-right">Egresos Sueldos</th>
                <th className="p-3 text-right">Egresos Compras</th>
                <th className="p-3 text-right">Egresos Totales</th>
                <th className="p-3 text-right">Ganancia Neta</th>
              </tr>
            </thead>
            <tbody>
              {resumenes.map((resumen, index) => (
                <tr
                  key={`${resumen.anio}-${resumen.mes}`}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-3 font-semibold">{nombreMes(resumen.mes)} {resumen.anio}</td>
                  <td className="p-3 text-right text-green-600">{formatoARS(resumen.ingresos)}</td>
                  <td className="p-3 text-right text-red-600">{formatoARS(resumen.egresosSueldos)}</td>
                  <td className="p-3 text-right text-red-600">{formatoARS(resumen.egresosCompras)}</td>
                  <td className="p-3 text-right">{formatoARS(resumen.egresos)}</td>
                  <td
                    className={`p-3 text-right font-bold ${
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
      )}
    </div>
  );
}

export default ResumenMensualTabla;
