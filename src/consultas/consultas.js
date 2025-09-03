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

//#region Empleados
export const obtenerEmpleados = async () => {
  const res = await axios.get(`https://localhost:7014/api/Empleado/getAllEmpleado`);
  return res.data;
};

export const crearEmpleado = async (empleado) => {
  const res = await axios.post(`https://localhost:7014/api/Empleado/createEmpleado`, empleado);
  return res.data;
}

export const obtenerEmpleadoPorCodigo = async (id) => {
  const res = await axios.delete(`https://localhost:7014/api/Empleado/getEmpleado/${id}`);
  return res.data;
}
//#endregion

//#region Pagos Empleados
export const crearPagoEmpleado = async (pagoEmpleadoDTO) => {
  const res = await axios.post(`https://localhost:7014/api/PagosEmpleado/createPagoEmpleado`, pagoEmpleadoDTO);
  return res.data;
};

export const obtenerPagosEmpleado = async () => {
  const res = await axios.get(`https://localhost:7014/api/PagosEmpleado/getPagosEmpleados`);
  return res.data;
}

export const obtenerPagoEmpleadoPorId = async (id) => {
  const res = await axios.get(`https://localhost:7014/api/PagosEmpleado/getPagoEmpleado/${id}`);
  return res.data;
}

export const obtenerPagoEmpleadoPorEmpleado = async (id) => {
  const res = await axios.get(`https://localhost:7014/api/PagosEmpleado/empleado/${id}`);
  return res.data;
}
//#endregion

//#region Proveedores
export const obtenerProveedores = async () => {
  const res = await axios.get('https://localhost:7014/api/Proveedor/getAll');
  return res.data;
};

export const crearProveedor = async (proveedorDTO) => {
  const res = await axios.post('https://localhost:7014/api/Proveedor/create', proveedorDTO);
  return res.data;
};
//#endregion

//#region Compras
export const obtenerCompras = async () => {
  const res = await axios.get('https://localhost:7014/api/Compra/getAll');
  return res.data;
};

export const crearCompra = async (compraDTO) => {
  const res = await axios.post('https://localhost:7014/api/Compra/create', compraDTO);
  return res.data;
};
//#endregion