export const ESTADOS = ["Pendiente", "En proceso", "Resuelta"];
export const PRIORIDADES = ["Alta", "Media", "Baja"];
export const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
export function filtrar(solicitudes, { estado, prioridad, busqueda }) {
  const texto = normalizar(busqueda);
  return solicitudes.filter(
    (s) =>
      (estado === "Todas" || s.estado === estado) &&
      (prioridad === "Todas" || s.prioridad === prioridad) &&
      normalizar(s.titulo).includes(texto),
  );
}
export function indicadores(solicitudes) {
  const total = solicitudes.length;
  const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;
  const proceso = solicitudes.filter((s) => s.estado === "En proceso").length;
  const resueltas = solicitudes.filter((s) => s.estado === "Resuelta").length;
  return {
    total,
    pendientes,
    proceso,
    resueltas,
    porcentaje: total ? Math.round((resueltas / total) * 100) : 0,
  };
}
