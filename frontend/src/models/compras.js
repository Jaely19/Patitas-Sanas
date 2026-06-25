// src/models/compras.js

export const comprasEstaticas = [
  {
    id: "a1b2c3d4-89ab-cdef-0123-456789abcdef", // Un string largo para que .slice(0, 8) funcione
    fecha: "2026-06-20T10:30:00Z",
    total: 850.00,
    detalles_pedido: [
      {
        id: "det-1",
        cantidad: 2,
        precio_unitario: 350.00,
        productos: { nombre: "Bulto de Croquetas Premium (Perro Adulto) 4kg" }
      },
      {
        id: "det-2",
        cantidad: 1,
        precio_unitario: 150.00,
        productos: { nombre: "Shampoo Antipulgas 500ml" }
      }
    ]
  },
  {
    id: "f9e8d7c6-1234-5678-abcd-ef0123456789",
    fecha: "2026-06-22T16:45:00Z",
    total: 450.00,
    detalles_pedido: [
      {
        id: "det-3",
        cantidad: 1,
        precio_unitario: 450.00,
        productos: { nombre: "Consulta General + Vacuna Quíntuple" }
      }
    ]
  },
  {
    id: "c3d4e5f6-2468-1357-bdfa-987654321abc",
    fecha: "2026-06-24T09:15:00Z",
    total: 270.00,
    detalles_pedido: [
      {
        id: "det-4",
        cantidad: 1,
        precio_unitario: 120.00,
        productos: { nombre: "Juguete mordedor resistente" }
      },
      {
        id: "det-5",
        cantidad: 1,
        precio_unitario: 150.00,
        productos: { nombre: "Correa retráctil" }
      }
    ]
  }
];