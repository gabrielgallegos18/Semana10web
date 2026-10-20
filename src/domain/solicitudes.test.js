import test from "node:test";
import assert from "node:assert/strict";
import { filtrar, indicadores } from "./solicitudes.js";
const datos = [
  { id: 1, titulo: "Conexión de red", prioridad: "Alta", estado: "Pendiente" },
  { id: 2, titulo: "Reparar red", prioridad: "Baja", estado: "Resuelta" },
  {
    id: 3,
    titulo: "Instalar software",
    prioridad: "Alta",
    estado: "En proceso",
  },
];
test("combina estado, prioridad y búsqueda sin distinguir acentos o mayúsculas", () => {
  assert.deepEqual(
    filtrar(datos, {
      estado: "Pendiente",
      prioridad: "Alta",
      busqueda: " CONEXION ",
    }).map((s) => s.id),
    [1],
  );
  assert.deepEqual(
    filtrar(datos, { estado: "Resuelta", prioridad: "Alta", busqueda: "" }),
    [],
  );
  assert.equal(
    filtrar(datos, { estado: "Todas", prioridad: "Todas", busqueda: "RED" }).length,
    2,
  );
});
test("los indicadores son globales y contemplan una lista vacía", () => {
  assert.deepEqual(indicadores([]), {
    total: 0,
    pendientes: 0,
    proceso: 0,
    resueltas: 0,
    porcentaje: 0,
  });
  assert.deepEqual(indicadores(datos), {
    total: 3,
    pendientes: 1,
    proceso: 1,
    resueltas: 1,
    porcentaje: 33,
  });
});
test("filtrar no modifica la colección original", () => {
  const copia = structuredClone(datos);
  filtrar(datos, { estado: "Todas", prioridad: "Alta", busqueda: "" });
  assert.deepEqual(datos, copia);
});
