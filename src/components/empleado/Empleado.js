import { useEffect, useState } from "react";
import {
    obtenerEmpleados,
    crearEmpleado,
    crearPagoEmpleado,
    obtenerPagoEmpleadoPorEmpleado
} from "../../consultas/consultas";

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
            console.error("Error al obtener empleados:", error);
        }
    };

    const handleCrearEmpleado = async () => {
        if (!nuevoEmpleado.nombre.trim()) return;
        try {
            await crearEmpleado(nuevoEmpleado);
            setNuevoEmpleado({ nombre: "" });
            cargarEmpleados();
        } catch (error) {
            console.error("Error al crear empleado:", error);
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
            alert("✅ Pago registrado");
        } catch (error) {
            console.error("Error al registrar pago:", error);
        }
    };

    const verPagosEmpleado = async () => {
        if (!empleadoSeleccionado) return;
        try {
            const pagos = await obtenerPagoEmpleadoPorEmpleado(empleadoSeleccionado);
            setPagosEmpleado(pagos);
        } catch (error) {
            console.error("Error al obtener pagos:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">👥 Gestión de Empleados</h2>

            {/* Crear Empleado */}
            <div className="mb-6">
                <h3 className="font-bold mb-2">➕ Crear Empleado</h3>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevoEmpleado.nombre}
                    onChange={(e) => setNuevoEmpleado({ nombre: e.target.value })}
                    className="border p-2 mr-2"
                />
                <button
                    onClick={handleCrearEmpleado}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Guardar
                </button>
            </div>

            {/* Crear Pago */}
            <div className="mb-6">
                <h3 className="font-bold mb-2">💸 Registrar Pago</h3>
                <select
                    value={pago.idEmpleado}
                    onChange={(e) => setPago({ ...pago, idEmpleado: e.target.value })}
                    className="border p-2 mr-2"
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
                    className="border p-2 mr-2"
                />
                <button
                    onClick={handleCrearPago}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Registrar Pago
                </button>
            </div>

            {/* Ver Pagos de Empleado */}
            <div className="mb-6">
                <h3 className="font-bold mb-2">📄 Ver Pagos de Empleado</h3>
                <div className="flex gap-2 items-center">
                    <select
                        value={empleadoSeleccionado}
                        onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                        className="border p-2"
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
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                        Ver Pagos
                    </button>
                </div>
            </div>

            {/* Tabla de pagos */}
            {empleadoSeleccionado && pagosEmpleado.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Historial de Pagos</h3>
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
                </div>
            )}


        </div>
    );
}

export default Empleado;
