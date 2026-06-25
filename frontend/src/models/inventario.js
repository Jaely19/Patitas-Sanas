// Modelo para la clínica (Uso interno de los veterinarios)
export const inventarioEstatico = [
  { id_producto: 1, nombre: "Amoxicilina 500mg", categoria: "Medicamentos", cantidad: 15, unidad: "Cajas", stock_minimo: 5 },
  { id_producto: 2, nombre: "Vendas elásticas", categoria: "Material de Curación", cantidad: 4, unidad: "Rollos", stock_minimo: 10 },
  { id_producto: 3, nombre: "Desparasitante", categoria: "Medicamentos", cantidad: 30, unidad: "Dosis", stock_minimo: 15 }
];

// Modelo para la tienda (Lo que compran los clientes)
export const productosEstaticos = [
  { id: 1, nombre: "Croquetas Dog Chow 2kg", precio: 150, stock: 10, imagen_url: "/fotos/croquetas.jpg" },
  { id: 2, nombre: "Correa retráctil", precio: 250, stock: 5, imagen_url: "/fotos/correa.png" },
  { id: 3, nombre: "Shampoo antipulgas", precio: 120, stock: 15, imagen_url: "/fotos/shampoo.jpg" }
];