import React, { useState, useEffect } from "react";
import ListProducts from "./../listProducts/ListProducts";
import { obtenerProductos, obtenerProductoPorCodigo, actualizarPrecioVenta } from "./../../consultas/consultas";

function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [todos, setTodos] = useState([]); // Para ver todos después de filtrar

  useEffect(() => {
    recargarProductos();
  }, []);

  const recargarProductos = async () => {
    const data = await obtenerProductos();
    setProductos(data);
    setTodos(data);
  };

  const buscarProducto = async (codigo) => {
    if (!codigo.trim()) return;
    try {
      const producto = await obtenerProductoPorCodigo(codigo);
      if (producto) {
        setProductos([producto]);
      } else {
        setProductos([]);
        alert("Producto no encontrado");
      }
    } catch (error) {
      setProductos([]);
      alert("Producto no encontrado");
    }
  };

  const verTodos = () => {
    setProductos(todos);
  };

  const handleUpdate = async (codigoBarra, nuevoPrecio) => {
    await actualizarPrecioVenta(codigoBarra, nuevoPrecio);
    recargarProductos();
  };

  return (
    <ListProducts
      productos={productos}
      buscarProducto={buscarProducto}
      verTodos={verTodos}
      recargarProductos={recargarProductos}
      handleUpdate={handleUpdate}
    />
  );
}

export default ProductsPage;