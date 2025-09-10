import { useEffect, useState } from "react";
import {
  obtenerEmpleados,
  crearEmpleado,
  crearPagoEmpleado,
  obtenerPagoEmpleadoPorEmpleado
} from "../../consultas/consultas";
import { toast } from "react-toastify";

function Empleado() {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "" });
  const [pago, setPago] = useState({ idEmpleado: "", monto: "" });
  const [pagosEmpleado, setPagosEmpleado] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const data = await obtenerEmpleados();
      setEmpleados(data);
    } catch (error) {
      toast.error("Error al obtener empleados:", error);
    }
  };

  const handleCrearEmpleado = async () => {
    if (!nuevoEmpleado.nombre.trim()) return;
    try {
      await crearEmpleado(nuevoEmpleado);
      setNuevoEmpleado({ nombre: "" });
      cargarEmpleados();
    } catch (error) {
      toast.error("Error al crear empleado:", error);
    }
  };

  const handleCrearPago = async () => {
    if (!pago.idEmpleado || !pago.monto) return;
    try {
      await crearPagoEmpleado({
        idEmpleado: pago.idEmpleado,
        fecha: new Date().toISOString(),
        monto: parseFloat(pago.monto)
      });
      setPago({ idEmpleado: "", monto: "" });
      toast.success("✅ Pago registrado");
    } catch (error) {
      toast.error("Error al registrar pago:", error);
    }
  };

  const verPagosEmpleado = async () => {
    if (!empleadoSeleccionado) {
      setPagosEmpleado([]);
      return;
    }
    try {
      const pagos = await obtenerPagoEmpleadoPorEmpleado(empleadoSeleccionado);
      setPagosEmpleado(pagos);
    } catch (error) {
      toast.error("Error al obtener pagos:", error);
      setPagosEmpleado([]);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">👥 Gestión de Empleados</h2>

      {/* Crear empleado y registrar pago */}
      <div className="mb-8 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-4">
          {/* Crear Empleado */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nombre del empleado"
              value={nuevoEmpleado.nombre}
              onChange={(e) => setNuevoEmpleado({ nombre: e.target.value })}
              className="border p-2 rounded"
            />
            <button
              onClick={handleCrearEmpleado}
              className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-800"
            >
              Guardar
            </button>
          </div>

          {/* Registrar Pago */}
          <div className="flex items-center gap-2">
            <select
              value={pago.idEmpleado}
              onChange={(e) => setPago({ ...pago, idEmpleado: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">Seleccionar empleado</option>
              {empleados.map((emp) => (
                <option key={emp.idEmpleado} value={emp.idEmpleado}>
                  {emp.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monto"
              value={pago.monto}
              onChange={(e) => setPago({ ...pago, monto: e.target.value })}
              className="border p-2 rounded"
            />
            <button
              onClick={handleCrearPago}
              className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-800"
            >
              Registrar Pago
            </button>
          </div>
        </div>
      </div>

      {/* Ver pagos */}
      <div className="mb-6 flex flex-col items-center">
        <h3 className="font-bold mb-2">📄 Ver Pagos de Empleado</h3>
        <div className="flex gap-2">
          <select
            value={empleadoSeleccionado}
            onChange={(e) => {
              setEmpleadoSeleccionado(e.target.value);
              setPagosEmpleado([]); // limpia pagos anteriores
            }}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar empleado</option>
            {empleados.map((emp) => (
              <option key={emp.idEmpleado} value={emp.idEmpleado}>
                {emp.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={verPagosEmpleado}
            className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-800"
          >
            Ver Pagos
          </button>
        </div>
      </div>

      {/* Tabla de pagos */}
      {empleadoSeleccionado && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 text-center">Historial de Pagos</h3>
          {pagosEmpleado.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Monto</th>
                </tr>
              </thead>
              <tbody>
                {pagosEmpleado.map((pago, index) => (
                  <tr key={index}>
                    <td className="p-2 border">
                      {new Date(pago.fecha).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">${pago.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Este empleado no tiene pagos registrados.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Empleado;
