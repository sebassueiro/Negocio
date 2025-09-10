import { useState, useEffect } from 'react';
import {
  obtenerClientes,
  crearCliente,
  obtenerPagosCliente,
  crearPagoCliente,
  crearDeudaCliente
} from '../../consultas/consultas';
import { toast } from "react-toastify";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [deudores, setDeudores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showClientModal, setShowClientModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [showDeudaModal, setShowDeudaModal] = useState(false);

  const [newCliente, setNewCliente] = useState({ nombre: '', telefono: '' });
  const [payment, setPayment] = useState({ idCliente: '', monto: '' });
  const [debt, setDebt] = useState({ idCliente: '', monto: '' });

  // Formatea ARS
  const formatoARS = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(valor);
  };

  // Fecha ISO ahora
  const obtenerFechaIso = () => new Date().toISOString();

  // Carga clientes y calcula los deudores
  useEffect(() => {
    loadDeudores();
  }, []);

  const loadDeudores = async () => {
    setLoading(true);
    try {
      const allClients = await obtenerClientes();
      setClientes(allClients);

      // Para cada cliente, traigo sus pagos y miro el saldo más reciente
      const pagosPorCliente = await Promise.all(
        allClients.map(c => obtenerPagosCliente(c.idCliente))
      );

      const listDeudores = allClients
        .map((c, i) => {
          const pagos = pagosPorCliente[i];
          const saldoActual = pagos.length
            ? pagos[0].saldo   // el endpoint devuelve pagos ordenados con el más reciente primero
            : 0;
          return { ...c, saldo: saldoActual };
        })
        .filter(c => c.saldo < 0);

      setDeudores(listDeudores);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleCreateCliente = async () => {
    if (!newCliente.nombre || !newCliente.telefono) return;
    await crearCliente(newCliente);
    setNewCliente({ nombre: '', telefono: '' });
    setShowClientModal(false);
    loadDeudores();
  };

  const handlePagar = async () => {
    if (!payment.idCliente || !payment.monto) return;
    await crearPagoCliente({
      idCliente: +payment.idCliente,
      fecha: obtenerFechaIso(),
      monto: +payment.monto,
      tipo: 'PAGO',
      saldo: 0
    });
    setPayment({ idCliente: '', monto: '' });
    setShowPagoModal(false);
    loadDeudores();
  };

  const handleDeuda = async () => {
    if (!debt.idCliente || !debt.monto) return;
    await crearDeudaCliente({
      idCliente: +debt.idCliente,
      fecha: obtenerFechaIso(),
      monto: +debt.monto,
      tipo: 'DEUDA',
      saldo: 0
    });
    setDebt({ idCliente: '', monto: '' });
    setShowDeudaModal(false);
    loadDeudores();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">💼 Clientes con Deuda</h2>

      {/* Botones de acción */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setShowClientModal(true)}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-800"
        >
          Crear Cliente
        </button>
        <button
          onClick={() => setShowPagoModal(true)}
          disabled={!deudores.length}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-800 disabled:opacity-50"
        >
          Pagar Deuda
        </button>
        <button
          onClick={() => setShowDeudaModal(true)}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-800"
        >
          Crear Deuda
        </button>
      </div>

      {/* Tabla de deudores */}
      <div className="bg-white shadow rounded p-4">
        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 border">Cliente</th>
                <th className="p-2 border">Teléfono</th>
                <th className="p-2 border text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {deudores.map(c => (
                <tr key={c.idCliente}>
                  <td className="p-2 border">{c.nombre}</td>
                  <td className="p-2 border">{c.telefono}</td>
                  <td className="p-2 border text-right text-red-600">
                    {formatoARS(c.saldo)}
                  </td>
                </tr>
              ))}
              {deudores.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-400">
                    No hay clientes con deuda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Crear Cliente */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center">
            <h2 className="text-lg font-bold mb-4">Nuevo Cliente</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newCliente.nombre}
              onChange={e => setNewCliente({ ...newCliente, nombre: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={newCliente.telefono}
              onChange={e => setNewCliente({ ...newCliente, telefono: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClientModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCliente}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pagar Deuda */}
      {showPagoModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center">
            <h2 className="text-lg font-bold mb-4">Registrar Pago</h2>
            <select
              value={payment.idCliente}
              onChange={e => setPayment({ ...payment, idCliente: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            >
              <option value="">Seleccionar cliente</option>
              {deudores.map(c => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombre} – deuda {formatoARS(c.saldo)}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monto a pagar"
              value={payment.monto}
              onChange={e => setPayment({ ...payment, monto: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPagoModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handlePagar}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crear Deuda */}
      {showDeudaModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center">
            <h2 className="text-lg font-bold mb-4">Nuevo Registro de Deuda</h2>
            <select
              value={debt.idCliente}
              onChange={e => setDebt({ ...debt, idCliente: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map(c => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monto de la deuda"
              value={debt.monto}
              onChange={e => setDebt({ ...debt, monto: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeudaModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeuda}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Crear Deuda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
