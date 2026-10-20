import { useEffect, useRef, useState } from "react";
import { cambiarEstado, listar, mensajeError, registrar } from "../services/api";

export default function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [intento, setIntento] = useState(0);
  const [ocupados, setOcupados] = useState([]);
  const bloqueos = useRef(new Set());

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError("");
    setAviso("");

    async function cargar() {
      try {
        const datos = await listar(controller.signal);
        if (!controller.signal.aborted) setSolicitudes(datos);
      } catch (error) {
        if (!controller.signal.aborted) setError(mensajeError(error));
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }

    cargar();
    return () => controller.abort();
  }, [intento]);

  async function crear(datos) {
    try {
      const nueva = await registrar(datos);
      setSolicitudes((actuales) => [...actuales, nueva]);
      setAviso(
        `Solicitud SOL-${String(nueva.id).padStart(3, "0")} registrada correctamente.`,
      );
    } catch (error) {
      throw new Error(mensajeError(error));
    }
  }

  async function resolver(id) {
    if (bloqueos.current.has(id)) return;
    bloqueos.current.add(id);
    setOcupados([...bloqueos.current]);
    setAviso("");

    try {
      const actualizada = await cambiarEstado(id, "Resuelta");
      setSolicitudes((actuales) =>
        actuales.map((solicitud) => (solicitud.id === id ? actualizada : solicitud)),
      );
      setAviso("Solicitud resuelta correctamente.");
    } catch (error) {
      setAviso(mensajeError(error));
    } finally {
      bloqueos.current.delete(id);
      setOcupados([...bloqueos.current]);
    }
  }

  return {
    solicitudes,
    cargando,
    error,
    aviso,
    ocupados,
    crear,
    resolver,
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
