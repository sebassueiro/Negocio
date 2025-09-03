import { useEffect, useState } from "react";
import {
  obtenerProveedores,
  crearProveedor,
  obtenerCompras,
  crearCompra,
} from "../../consultas/consultas";

function Proveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modales
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [showCompraModal, setShowCompraModal] = useState(false);

  // Estados
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    descripcion: "",
  });
  const [compra, setCompra] = useState({ idProveedor: "", total: "" });

  // Filtros
  const [proveedorFiltro, setProveedorFiltro] = useState("");
  const [mesFiltro, setMesFiltro] = useState("");

  const obtenerFechaHoy = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T12:00:00`;
  };

  const formatoARS = (valor) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(valor);
  };

  useEffect(() => {
    cargarProveedores();
    cargarCompras();
  }, []);

  const cargarProveedores = async () => {
    try {
      const data = await obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };

  const cargarCompras = async () => {
    setLoading(true);
    try {
      const data = await obtenerCompras();
      setCompras(data);
    } catch (error) {
      console.error("Error al cargar compras:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProveedor = async () => {
    if (!nuevoProveedor.nombre || !nuevoProveedor.descripcion) return;
    try {
      await crearProveedor(nuevoProveedor);
      setNuevoProveedor({ nombre: "", descripcion: "" });
      setShowProveedorModal(false);
      cargarProveedores();
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    }
  };

  const handleCrearCompra = async () => {
    if (!compra.idProveedor || !compra.total) return;
    try {
      const proveedor = proveedores.find(
        (p) => p.idProveedor === parseInt(compra.idProveedor)
      );
      const compraDTO = {
        idProveedor: parseInt(compra.idProveedor),
        fecha: obtenerFechaHoy(),
        total: parseFloat(compra.total),
        nombreEmpresa: proveedor?.descripcion ?? "", // usamos descripcion como nombre empresa
      };
      await crearCompra(compraDTO);
      setCompra({ idProveedor: "", total: "" });
      setShowCompraModal(false);
      cargarCompras();
      alert("Compra registrada con éxito ✅");
    } catch (error) {
      console.error("Error al registrar compra:", error);
    }
  };

  // Filtrar compras
  const comprasFiltradas = compras.filter((c) => {
    let coincideProveedor =
      !proveedorFiltro || c.idProveedor === parseInt(proveedorFiltro);
    let coincideMes =
      !mesFiltro ||
      new Date(c.fecha).getMonth() + 1 === parseInt(mesFiltro);
    return coincideProveedor && coincideMes;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🧾 Gestión de Compras</h2>

      {/* Botones abrir modales */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setShowProveedorModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Crear Proveedor
        </button>
        <button
          onClick={() => setShowCompraModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🛒 Registrar Compra
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
        <select
          value={proveedorFiltro}
          onChange={(e) => setProveedorFiltro(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los proveedores</option>
          {proveedores.map((p) => (
            <option key={p.idProveedor} value={p.idProveedor}>
              {p.descripcion}
            </option>
          ))}
        </select>

        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los meses</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>

      {/* Tabla de compras */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2 text-center">📦 Compras registradas</h3>
        {loading ? (
          <p className="text-center text-gray-500">Cargando compras...</p>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 border">Empresa</th>
                  <th className="p-2 border text-right">Total</th>
                  <th className="p-2 border text-right">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {[...comprasFiltradas]
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  .map((c) => (
                    <tr key={c.idCompra}>
                      <td className="p-2 border">{c.nombreEmpresa}</td>
                      <td className="p-2 border text-right">
                        {formatoARS(c.total)}
                      </td>
                      <td className="p-2 border text-right">
                        {new Date(c.fecha).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))}
                {comprasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-400">
                      No hay compras registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Proveedor */}
      {showProveedorModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-semibold mb-4">➕ Nuevo Proveedor</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoProveedor.nombre}
              onChange={(e) =>
                setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Nombre de la empresa"
              value={nuevoProveedor.descripcion}
              onChange={(e) =>
                setNuevoProveedor({
                  ...nuevoProveedor,
                  descripcion: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowProveedorModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearProveedor}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Compra */}
      {showCompraModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-semibold mb-4">🛒 Nueva Compra</h3>
            <select
              value={compra.idProveedor}
              onChange={(e) =>
                setCompra({ ...compra, idProveedor: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Seleccionar empresa</option>
              {proveedores.map((p) => (
                <option key={p.idProveedor} value={p.idProveedor}>
                  {p.descripcion}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Total de la compra"
              value={compra.total}
              onChange={(e) =>
                setCompra({ ...compra, total: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCompraModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearCompra}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proveedor;
