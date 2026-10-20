export default function SolicitudCard({ solicitud, onResolver, ocupado }) {
  const { id, titulo, prioridad, estado } = solicitud;
  return (
    <article className="ticket">
      <div className="ticket-top">
        <span className="ticket-id">SOL-{String(id).padStart(3, "0")}</span>
        <span className={`priority priority-${prioridad.toLowerCase()}`}>
          {prioridad}
        </span>
      </div>
      <h3>{titulo}</h3>
      <div className="ticket-bottom">
        <span className={`status status-${estado.replaceAll(" ", "-").toLowerCase()}`}>
          <i />
          {estado}
        </span>
        {estado !== "Resuelta" ? (
          <button
            className="resolve"
            disabled={ocupado}
            onClick={() => onResolver(id)}
            aria-label={`Resolver solicitud: ${titulo}`}
          >
            {ocupado ? "Resolviendo…" : "Resolver ↗"}
          </button>
        ) : (
          <span className="completed">Completada ✓</span>
        )}
      </div>
    </article>
  );
}
