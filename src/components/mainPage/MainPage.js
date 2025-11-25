import React, { useState, useRef } from 'react';
import { obtenerProductoPorCodigo, crearVenta } from '../../consultas/consultas';
import ModalPrecioVariable from './../modalPrecioVariable/ModalPrecioVariable';
import { toast } from 'react-toastify';

function MainPage() {
  const [productos, setProductos] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [esFiado, setEsFiado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [precioManual, setPrecioManual] = useState('');
  const lastEnterRef = useRef(0);
  const inputCodigoRef = useRef(null);

  const formatoARS = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(valor);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (codigo.trim() !== "") {
        agregarProducto();
      } else {
        const ahora = Date.now();
        if (ahora - lastEnterRef.current < 500) {
          finalizarVenta(); // Doble Enter → finalizar
        }
        lastEnterRef.current = ahora;
      }
    }
  };

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
          const key = producto.codigoBarra ?? producto.codigo;
          const existe = prev.find(p => (p.codigoBarra ?? p.codigo) === key);
          if (existe) {
            return prev.map(p =>
              (p.codigoBarra ?? p.codigo) === key
                ? { ...p, cantidad: p.cantidad + 1 }
                : p
            );
          }
          return [
            ...prev,
            {
              ...producto,
              cantidad: 1,
              precioVenta:
                producto.precioVenta ??
                producto.precio_venta ??
                producto.precio ??
                0,
            },
          ];
        });
      }
    } catch {
      toast.error('Producto no encontrado');
    } finally {
      setCodigo('');
      inputCodigoRef.current?.focus();
    }
  };

  const confirmarPrecioVariable = () => {
    if (!precioManual) return;
    setProductos(prev => [
      ...prev,
      {
        ...productoActual,
        cantidad: 1,
        precioVenta: parseFloat(precioManual),
      },
    ]);
    setPrecioManual('');
    setProductoActual(null);
    setShowModal(false);
    // focus volverá al input de código desde el callback onConfirm que pasamos al modal
  };

  const eliminarProducto = (idx) => {
    setProductos(prev => prev.filter((_, i) => i !== idx));
  };

  const finalizarVenta = async () => {
    try {
      if (productos.length === 0) {
        toast.error("Debe agregar al menos un producto antes de finalizar la venta ⚠️");
        return;
      }

      const ventaDTO = {
        idEmpleado: null,
        idCliente: null,
        esFiado,
        total: productos.reduce((sum, p) => sum + p.precioVenta * p.cantidad, 0),
        detalle: productos.map(p => ({
          codigoBarra: p.codigoBarra ?? p.codigo,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precioUnitario: p.precioVenta,
        })),
      };

      await crearVenta(ventaDTO);
      toast.success("Venta registrada con éxito ✅");

      // Reset
      setProductos([]);
      setCodigo('');
      setEsFiado(false);
      inputCodigoRef.current?.focus();
    } catch (error) {
      toast.error("Hubo un error al registrar la venta ❌", { autoClose: 3000 });
    }
  };

  const total = productos.reduce((sum, p) => sum + p.precioVenta * p.cantidad, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 flex justify-between items-start p-6">
        {/* IZQUIERDA */}
        <div className="flex-1 max-w-3xl mr-8">
          <div className="flex mb-4 gap-2">
            <input
              id="barcode-input"
              ref={inputCodigoRef}                // <- ref agregado
              type="text"
              placeholder="Código de barra"
              className="flex-1 p-2 border rounded-l-md focus:outline-none"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              onClick={agregarProducto}
              className="bg-slate-700 text-white px-4 rounded hover:bg-slate-900"
            >
              Agregar
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Código</th>
                  <th className="p-3 font-semibold">Nombre</th>
                  <th className="p-3 font-semibold text-right">Precio</th>
                  <th className="p-3 font-semibold text-right">Cant.</th>
                  <th className="p-3 font-semibold text-right">Subtotal</th>
                  <th className="p-3 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr
                    key={i}
                    className={`${i % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50`}
                  >
                    <td className="p-3">{p.codigoBarra ?? p.codigo}</td>
                    <td className="p-3">{p.nombre}</td>
                    <td className="p-3 text-right">{formatoARS(p.precioVenta)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (p.cantidad > 1) {
                              const copy = [...productos];
                              copy[i].cantidad--;
                              setProductos(copy);
                            }
                          }}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{p.cantidad}</span>
                        <button
                          onClick={() => {
                            const copy = [...productos];
                            copy[i].cantidad++;
                            setProductos(copy);
                          }}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {formatoARS(p.precioVenta * p.cantidad)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => eliminarProducto(i)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      No hay productos en la caja.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DERECHA */}
        <div className="w-[500px] bg-white p-4 shadow-md flex flex-col justify-between h-[500px]">
          <div className="flex flex-col items-center">
            <h2 className="text-6xl mb-6">{formatoARS(total)}</h2>
          </div>
          <div className="mt-auto">
            <button
              onClick={() => finalizarVenta()}
              className="bg-slate-600 text-white px-6 py-4 rounded-lg text-xl font-semibold hover:bg-slate-800 transition w-full"
            >
              Finalizar venta
            </button>
          </div>
        </div>
      </main>

      {/* Modal precio variable */}
      {showModal && (
        <ModalPrecioVariable
          producto={productoActual}
          precio={precioManual}
          setPrecio={setPrecioManual}
          onConfirm={() => {
            confirmarPrecioVariable();
            // dar un pequeño delay para asegurar que el modal se haya desmontado
            setTimeout(() => inputCodigoRef.current?.focus(), 50);
          }}
          onClose={() => {
            setShowModal(false);
            setTimeout(() => inputCodigoRef.current?.focus(), 50);
          }}
        />
      )}
    </div>
  );
}

export default MainPage;
