import React, { useState, useEffect } from "react";
import ListProducts from "./../listProducts/ListProducts";
import CreateProduct from "./../createProduct/CreateProduct";  
import { obtenerProductos, obtenerProductoPorCodigo, actualizarProducto, crearProducto } from "./../../consultas/consultas";
import { toast } from "react-toastify";

function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

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
        toast.error("Producto no encontrado");
      }
    } catch (error) {
      setProductos([]);
      toast.error("Producto no encontrado");
    }
  };

  const verTodos = () => {
    setProductos(todos);
  };

const handleUpdate = async (codigoBarra, productoData) => {
  await actualizarProducto(codigoBarra, productoData);
  recargarProductos();
};


  const handleCreate = async (nuevoProducto) => {
    await crearProducto(nuevoProducto);
    recargarProductos();
  };

  return (
    <>
    <ListProducts
      productos={productos}
      buscarProducto={buscarProducto}
      verTodos={verTodos}
      recargarProductos={recargarProductos}
      handleUpdate={handleUpdate}
      abrirModal={() => setOpenCreate(true)}
    />
    <CreateProduct
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreate}
      />
    </>  
  );
}

export default ProductsPage;