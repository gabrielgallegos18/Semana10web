import { ESTADOS, PRIORIDADES } from "../domain/solicitudes";

export default function FiltrosSolicitudes({ filtros, onCambiar }) {
  return (
    <div className="filters">
      <div className="search">
        <label htmlFor="busqueda">Buscar solicitud</label>
        <input
          id="busqueda"
          type="search"
          placeholder="Buscar por descripción…"
          value={filtros.busqueda}
          onChange={(e) => onCambiar("busqueda", e.target.value)}
        />
        {filtros.busqueda && (
          <button className="text-button" onClick={() => onCambiar("busqueda", "")}>
            Limpiar búsqueda
          </button>
        )}
      </div>
      <div>
        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
          value={filtros.estado}
          onChange={(e) => onCambiar("estado", e.target.value)}
        >
          <option>Todas</option>
          {ESTADOS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filtro-prioridad">Prioridad</label>
        <select
          id="filtro-prioridad"
          value={filtros.prioridad}
          onChange={(e) => onCambiar("prioridad", e.target.value)}
        >
          <option>Todas</option>
          {PRIORIDADES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
