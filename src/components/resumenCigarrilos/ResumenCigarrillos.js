import { useEffect, useState } from 'react';
import { ResumenCigarrillo } from "./../../consultas/consultas";
import { toast } from "react-toastify";

function ResumenCigarrillos() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let mounted = true;
    const fetchResumen = async () => {
      setLoading(true);
      try {
        const fechaFormateada = obtenerFechaLocal();
        const data = await ResumenCigarrillo(fechaFormateada);
        if (!mounted) return;
        if (!data || !Array.isArray(data.detalles)) {
          setResumen({ detalles: [], totalCigarrillos: 0 });
          toast.info("No hay datos disponibles para hoy");
        } else {
          setResumen(data);
        }
      } catch (err) {
        console.error("Error al obtener el resumen de cigarrillos:", err);
        toast.error("Error al cargar el resumen");
        setResumen({ detalles: [], totalCigarrillos: 0 });
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

  return (
    <div className="p-6 mt-10 w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">🚬 Resumen de Cigarrillos - {fechaHoy}</h2>

      {loading ? (
        <p className="text-gray-500">Cargando resumen...</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-6xl shadow-md rounded-xl border">
          <table className="w-full border-collapse bg-white rounded-xl">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-right">Cantidad</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {(!resumen || resumen.detalles.length === 0) ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No se han registrado ventas de cigarrillos hoy.
                  </td>
                </tr>
              ) : (
                resumen.detalles.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-3 font-medium text-sm">{idx + 1}</td>
                    <td className="p-3 break-words">{item.nombre}</td>
                    <td className="p-3 text-right">{item.cantidad}</td>
                    <td className="p-3 text-right">{formatoARS(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="p-3 text-left" colSpan={2}>Total</td>
                <td className="p-3 text-right">{resumen?.detalles?.reduce((s, it) => s + (Number(it.cantidad) || 0), 0) ?? 0}</td>
                <td className="p-3 text-right">{formatoARS(resumen?.totalCigarrillos ?? 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResumenCigarrillos;
