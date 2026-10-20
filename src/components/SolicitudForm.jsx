import { useRef, useState } from "react";
import { PRIORIDADES } from "../domain/solicitudes";
export default function SolicitudForm({ onRegistrar }) {
  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const bloqueo = useRef(false);
  async function enviar(e) {
    e.preventDefault();
    if (bloqueo.current) return;
    if (titulo.trim().length < 5 || titulo.trim().length > 160) {
      setError("Escribe una descripción de entre 5 y 160 caracteres.");
      return;
    }
    bloqueo.current = true;
    setEnviando(true);
    setError("");
    try {
      await onRegistrar({ titulo: titulo.trim(), prioridad });
      setTitulo("");
      setPrioridad("Media");
    } catch (e) {
      setError(e.message);
    } finally {
      bloqueo.current = false;
      setEnviando(false);
    }
  }
  return (
    <section className="form-panel" aria-labelledby="nuevo-titulo">
      <div className="panel-icon">＋</div>
      <h2 id="nuevo-titulo">Nueva solicitud</h2>
      <p>Cuéntanos qué necesitas. Nos encargamos del resto.</p>
      <form onSubmit={enviar}>
        <label htmlFor="titulo">Descripción del problema</label>
        <textarea
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={160}
          required
          minLength={5}
          placeholder="Ej. No puedo conectarme a la red de la oficina"
          disabled={enviando}
          aria-describedby="ayuda-titulo"
        />
        <small id="ayuda-titulo">Entre 5 y 160 caracteres · {titulo.length}/160</small>
        <label htmlFor="prioridad">Prioridad</label>
        <select
          id="prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          disabled={enviando}
        >
          {PRIORIDADES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="primary" type="submit" disabled={enviando}>
          {enviando ? "Registrando…" : "Registrar solicitud →"}
        </button>
      </form>
      <div className="help">
        <strong>¿Qué puedes reportar?</strong>
        <ul>
          <li>Hardware</li>
          <li>Software</li>
          <li>Redes</li>
        </ul>
        <button
          className="text-button"
          onClick={() =>
            alert(
              "Describe el problema, selecciona su prioridad y registra la solicitud. Puedes consultar su estado en el tablero.",
            )
          }
        >
          Ver orientación
        </button>
        <br />
        <button
          className="text-button"
          onClick={() =>
            alert("Bienvenido al Sistema de Soporte Técnico de Servicios Web.")
          }
        >
          Acerca del sistema
        </button>
      </div>
    </section>
  );
}
