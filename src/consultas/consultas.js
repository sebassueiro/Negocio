import axios from 'axios';
//#region Productos
export const obtenerProductos = async () => {
  const res = await axios.get(`https://localhost:7014/api/Producto/getAllProductos`);
  return res.data;
};

export const obtenerProductoPorCodigo = async (codigoBarra) => {
  const res = await axios.get(`https://localhost:7014/api/Producto/getProducto/${codigoBarra}`);
  return res.data;
};

export const actualizarPrecioVenta = async (codigoBarra, nuevoPrecio) => {
  const res = await axios.put(`https://localhost:7014/api/Producto/updateProducto/${codigoBarra}`, { precioVenta: nuevoPrecio });
  return res.data;
}

export const crearProducto = async (producto) => {
  const res = await axios.post(`https://localhost:7014/api/Producto/createProducto`, producto);
  return res.data;
}
//#endregion

//#region Ventas
export const crearVenta = async (ventaDTO) => {
  const res = await axios.post(`https://localhost:7014/api/Ventas`, ventaDTO);
  return res.data;
};
//#endregion

//#region ResumenDiario
export const ResumenDiario = async (fechaFormateada) => {
  const res = await axios.get(`https://localhost:7014/api/ResumenDiario/${fechaFormateada}`);
  return res.data;
};
//#endregion

//#region ResumenMensual
export const ResumenMensual = async (mes) => {
  const res = await axios.get(`https://localhost:7014/api/ResumenMensual/2025/${mes}`);
  return res.data;
};
//#endregion

//#region ResumenCigarrillos
export const ResumenCigarrillo = async (fechaFormateada) => {
  const res = await axios.get(`https://localhost:7014/api/ResumenCigarrillos/${fechaFormateada}`);
  return res.data;
};
//#endregion