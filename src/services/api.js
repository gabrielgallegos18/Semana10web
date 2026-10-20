import axios from "axios";
import { ESTADOS, PRIORIDADES } from "../domain/solicitudes";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 8000,
});
function validar(s) {
  if (
    !s ||
    !Number.isInteger(s.id) ||
    typeof s.titulo !== "string" ||
    !ESTADOS.includes(s.estado) ||
    !PRIORIDADES.includes(s.prioridad)
  ) {
    throw new Error("La API devolvió una solicitud con formato inválido.");
  }
  return s;
}
export async function listar(signal) {
  const { data } = await api.get("/solicitudes", { signal });
  if (!Array.isArray(data)) throw new Error("La API no devolvió una lista válida.");
  return data.map(validar);
}
export async function registrar(datos) {
  return validar((await api.post("/solicitudes", datos)).data);
}
export async function cambiarEstado(id, estado) {
  return validar((await api.patch(`/solicitudes/${id}/estado`, { estado })).data);
}
export function mensajeError(error) {
  if (error.response?.status === 400)
    return error.response.data?.message || "Revisa los datos enviados.";
  if (error.response?.status === 404)
    return "No se encontró el recurso solicitado. Actualiza la lista.";
  if (error.code === "ECONNABORTED")
    return "El servidor tardó demasiado en responder. Intenta nuevamente.";
  if (!error.response && error.isAxiosError)
    return "No se pudo conectar con el servidor. Verifica que Spring Boot esté activo en el puerto 8080 y revisa CORS.";
  return error.isAxiosError
    ? "No se pudo completar la operación. Intenta nuevamente."
    : error.message;
}
