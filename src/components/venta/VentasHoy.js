import React, { useEffect, useState } from "react";
import { obtenerVentas } from "../../consultas/consultas";

function VentasHoy() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await obtenerVentas();
        // Ordenar de la última a la primera
        const ordenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setVentas(ordenadas);
      } catch (error) {
        console.error("Error al obtener ventas", error);
      }
    };
    fetchVentas();
  }, []);

  const formatoARS = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(valor);

  const printTicket = (venta) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Tickets</title>
          <style>
            /* Página completa de 80 mm sin márgenes */
          @page { size: 80mm auto; margin: 0; }
          @media print {
            html, body { width: 80mm; margin: 0; padding: 0; }
          }
          body {
            width: 78mm;
            margin: 1mm auto;
            padding: 0;
            font-family: monospace;
            line-height: 1.2;
          }
            * --------------------------------------------------
             Estilos comunes para los tickets
          -------------------------------------------------- */
          .divider { border-top: 1px dashed #000; margin: 4px 0; }
          .center  { text-align: center; word-wrap: break-word; }
          .cols, .total { display: flex; justify-content: space-between; }
          .producto { flex: 1 1 auto; white-space: pre-wrap; word-break: break-word; }

          /* --------------------------------------------------
             Ticket 80 mm
          -------------------------------------------------- */
          .ticket80 { margin-bottom: 8mm; /* espacio antes del segundo */ }
          .ticket80 .cnt     { flex: 0 0 10mm; text-align: right; margin: 0 1mm; }
          .ticket80 .importe { flex: 0 0 18mm; text-align: right; }
          .ticket80 .total   { font-weight: bold; margin-top: 4px; }
            
          </style>
        </head>
        <body>
          <!-- ======== TICKET 80 MM ======== -->
        <div class="ticket80">
          <div class="center">LO DE OSVALDO</div>
          <div class="divider"></div>
          <div class="cols">
            <span class="producto">PRODUCTO</span>
            <span class="cnt">Cnt</span>
            <span class="importe">Importe</span>
          </div>
          <div class="divider"></div>
          ${venta.detalle.map(item => `
            <div class="cols">
              <span class="producto">${item.nombre}</span>
              <span class="cnt">${item.cantidad}</span>
              <span class="importe">${formatoARS(item.precioUnitario * item.cantidad)}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="total cols">
            <span>TOTAL</span>
            <span>${formatoARS(venta.total)}</span>
          </div>
        </div>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ventas del Día</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="max-h-[750px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 font-semibold">Fecha</th>
              <th className="p-3 font-semibold">Horario</th>
              <th className="p-3 font-semibold text-right">Total</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, i) => (
              <tr
                key={venta.idVenta}
                className={`${i % 2 ? "bg-gray-50" : "bg-white"} hover:bg-green-50`}
              >
                <td className="p-3">{new Date(venta.fecha).toLocaleString()}</td>
                <td className="p-3 text-right">{formatoARS(venta.total)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => printTicket(venta)}
                    className="bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-900"
                  >
                    Imprimir
                  </button>
                </td>
              </tr>
            ))}
            {ventas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No hay ventas registradas hoy.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default VentasHoy;
