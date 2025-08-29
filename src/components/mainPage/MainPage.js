import React, { useState } from 'react';
import { obtenerProductoPorCodigo } from '../../consultas/consultas';
import ModalPrecioVariable from './../modalPrecioVariable/ModalPrecioVariable';


function MainPage() {
  const [productos, setProductos] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [esFiado, setEsFiado] = useState(false);
  const [imprimirTicket, setImprimirTicket] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [precioManual, setPrecioManual] = useState('');

  const agregarProducto = async () => {
    if (!codigo) return;
    try {
      const producto = await obtenerProductoPorCodigo(codigo);
      if (producto) {
        if (producto.esPrecioVariable) {
          setProductoActual(producto);
          setShowModal(true);
          setCodigo('');
          return;
        }
        setProductos(prev => {
          const existe = prev.find(p => (p.codigoBarra ?? p.codigo) === (producto.codigoBarra ?? producto.codigo));
          if (existe) {
            return prev.map(p =>
              (p.codigoBarra ?? p.codigo) === (producto.codigoBarra ?? producto.codigo)
                ? { ...p, cantidad: p.cantidad + 1 }
                : p
            );
          } else {
            return [
              ...prev,
              {
                ...producto,
                cantidad: 1,
                precioVenta: producto.precioVenta ?? producto.precio_venta ?? producto.precio ?? 0
              }
            ];
          }
        });
      }
      setCodigo('');
    } catch (error) {
      alert('Producto no encontrado');
      setCodigo('');
    }
  };

  const confirmarPrecioVariable = () => {
    if (!precioManual) return;
    setProductos(prev => [
      ...prev,
      {
        ...productoActual,
        cantidad: 1,
        precioVenta: parseFloat(precioManual)
      }
    ]);
    setPrecioManual('');
    setProductoActual(null);
    setShowModal(false);
  };

  const aumentarCantidad = (idx) => {
    const nuevos = [...productos];
    nuevos[idx].cantidad += 1;
    setProductos(nuevos);
  };

  const disminuirCantidad = (idx) => {
    const nuevos = [...productos];
    if (nuevos[idx].cantidad > 1) {
      nuevos[idx].cantidad -= 1;
    }
    setProductos(nuevos);
  };

  const eliminarProducto = (idx) => {
    const nuevos = productos.filter((_, i) => i !== idx);
    setProductos(nuevos);
  };


  const total = productos.reduce((acc, p) => acc + (p.precioVenta * p.cantidad), 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 flex justify-between items-start p-6">
        {/* Izquierda: barra de búsqueda y tabla */}
        <div className="flex-1 max-w-3xl mr-8">
          <div className="flex mb-4 gap-2">
            <input
              type="text"
              placeholder="Código de barra"
              className="flex-1 p-2 border rounded-l-md focus:outline-none"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregarProducto()}
            />
            <button
              onClick={agregarProducto}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Código de Barra</th>
                  <th className="p-3 font-semibold">Nombre</th>
                  <th className="p-3 font-semibold text-right">Precio</th>
                  <th className="p-3 font-semibold text-right">Cantidad</th>
                  <th className="p-3 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod, idx) => (
                  <tr
                    key={prod.codigoBarra ?? prod.codigo}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-green-50 transition`}
                  >
                    <td className="p-3">{prod.codigoBarra ?? prod.codigo}</td>
                    <td className="p-3">{prod.nombre}</td>
                    <td className="p-3 text-right">
                      ${prod.precioVenta}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (prod.cantidad > 1) {
                              const nuevos = [...productos];
                              nuevos[idx].cantidad -= 1;
                              setProductos(nuevos);
                            }
                          }}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{prod.cantidad}</span>
                        <button
                          onClick={() => {
                            const nuevos = [...productos];
                            nuevos[idx].cantidad += 1;
                            setProductos(nuevos);
                          }}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      ${prod.precioVenta * prod.cantidad}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => eliminarProducto(idx)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400">
                      No hay productos en la caja.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Derecha: total, checkpoints y botón */}
        <div className="w-80 bg-white p-4 shadow-md flex flex-col justify-between h-[500px]">
          <div>
            <h2 className="text-xl font-bold mb-4">Total: ${total}</h2>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={esFiado}
                  onChange={() => setEsFiado(!esFiado)}
                  className="accent-blue-600"
                />
                <span>¿Es fiado?</span>
              </label>
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={imprimirTicket}
                  onChange={() => setImprimirTicket(!imprimirTicket)}
                  className="accent-blue-600"
                />
                <span>Imprimir ticket</span>
              </label>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition mt-4">
            Finalizar venta
          </button>
        </div>
      </main>
      {showModal && (
        <ModalPrecioVariable
          producto={productoActual}
          precio={precioManual}
          setPrecio={setPrecioManual}
          onConfirm={confirmarPrecioVariable}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default MainPage;
