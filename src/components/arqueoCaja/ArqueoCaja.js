import { useEffect, useState } from 'react';
import { ResumenDiario } from "./../../consultas/consultas";
import { toast } from "react-toastify";

function ArqueoCaja() {
  const [resumen, setResumen] = useState({
    fecha: null,
    ingresos: 0,
    egresos: 0,
    gananciaNeta: 0
  });
  const [loading, setLoading] = useState(true);

  const obtenerFechaLocal = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    let mounted = true;
    const fetchResumen = async () => {
      setLoading(true);
      try {
        const fechaFormateada = obtenerFechaLocal();
        const data = await ResumenDiario(fechaFormateada);
        if (!mounted) return;

        const ingresos = Number(data?.ingresos ?? 0);
        const egresos = Number(data?.egresos ?? 0);
        const gananciaNeta = Number(data?.gananciaNeta ?? (ingresos - egresos));
        setResumen({
          fecha: data?.fecha ?? `${fechaFormateada}T00:00:00`,
          ingresos,
          egresos,
          gananciaNeta
        });
      } catch (err) {
        console.error("Error al obtener el resumen diario:", err);
        toast.error("Error al cargar el arqueo");
        setResumen({
          fecha: obtenerFechaLocal(),
          ingresos: 0,
          egresos: 0,
          gananciaNeta: 0
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResumen();
    return () => { mounted = false; };
  }, []);

  const formatoARS = (valor) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(Number(valor ?? 0));

  const formatearFechaResumen = (fechaISO) => {
    if (!fechaISO) return new Date().toLocaleDateString('es-AR');
    const parte = String(fechaISO).split("T")[0];
    const [anio, mes, dia] = parte.split("-");
    if (!anio || !mes || !dia) return new Date().toLocaleDateString('es-AR');
    const fecha = new Date(`${anio}-${mes}-${dia}T12:00:00`);
    return fecha.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="p-6 mt-10 w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">🧾 Arqueo de Caja</h2>

      {loading ? (
        <p className="text-gray-500">Cargando arqueo...</p>
      ) : (
        <div className="w-full max-w-4xl shadow-md rounded-xl border bg-white p-4">
          <div className="mb-4 text-center text-sm text-gray-600">
            {formatearFechaResumen(resumen.fecha)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Ingresos</div>
              <div className="text-2xl font-semibold text-green-600 mt-2">
                {formatoARS(resumen.ingresos)}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Egresos</div>
              <div className="text-2xl font-semibold text-red-600 mt-2">
                {formatoARS(resumen.egresos)}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Ganancia Neta</div>
              <div className={`text-2xl font-semibold mt-2 ${resumen.gananciaNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatoARS(resumen.gananciaNeta)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArqueoCaja;
