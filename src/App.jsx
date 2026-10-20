import { useState } from "react";
import useSolicitudes from "./hooks/useSolicitudes";
import FiltrosSolicitudes from "./components/FiltrosSolicitudes";
import { filtrar } from "./domain/solicitudes";
import SolicitudCard from "./components/SolicitudCard";
import SolicitudForm from "./components/SolicitudForm";
import Indicadores from "./components/Indicadores";
export default function App() {
  const { solicitudes, cargando, error, aviso, ocupados, crear, resolver, reintentar } =
    useSolicitudes();
  const [filtros, setFiltros] = useState({
    estado: "Todas",
    prioridad: "Todas",
    busqueda: "",
  });
  const visibles = filtrar(solicitudes, filtros);
  function cambiar(nombre, valor) {
    setFiltros((actual) => ({ ...actual, [nombre]: valor }));
  }
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="topbar">
        <a className="brand" href="/" aria-label="Mesa de soporte, inicio">
          <span className="brand-icon">S</span>
          <span>
            Mesa de soporte<small>Servicios Web · Laboratorio 10</small>
          </span>
        </a>
        <span className="header-tag">Gestión de solicitudes</span>
      </header>
      <main id="contenido">
        <section className="intro">
          <div>
            <p className="eyebrow">CENTRO DE ATENCIÓN</p>
            <h1>Todo bajo control.</h1>
            <p>Organiza, da seguimiento y resuelve las solicitudes de soporte técnico.</p>
          </div>
          <span className="intro-note">Hardware · Software · Redes</span>
        </section>
        {!cargando && !error && <Indicadores solicitudes={solicitudes} />}
        <p className="notice" role="status" aria-live="polite">
          {aviso}
        </p>
        <div className="workspace">
          <section className="list-panel" aria-labelledby="list-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">TU ESPACIO DE TRABAJO</p>
                <h2 id="list-title">Solicitudes</h2>
              </div>
              <span className="count">
                {!cargando && !error
                  ? `${visibles.length} resultados`
                  : "Conectando con la API"}
              </span>
            </div>
            <FiltrosSolicitudes filtros={filtros} onCambiar={cambiar} />
            {cargando ? (
              <div className="empty" role="status">
                <span className="spinner" />
                <h3>Cargando solicitudes…</h3>
                <p>Consultando el servicio de soporte.</p>
              </div>
            ) : error ? (
              <div className="empty" role="alert">
                <h3>No pudimos cargar las solicitudes</h3>
                <p>{error}</p>
                <button className="primary" onClick={reintentar}>
                  Reintentar
                </button>
              </div>
            ) : (
              <>
                <div className="tickets">
                  {visibles.map((s) => (
                    <SolicitudCard
                      key={s.id}
                      solicitud={s}
                      onResolver={resolver}
                      ocupado={ocupados.includes(s.id)}
                    />
                  ))}
                </div>
                {!visibles.length && (
                  <div className="empty">
                    <h3>
                      {solicitudes.length
                        ? "Sin coincidencias"
                        : "Tu bandeja está al día"}
                    </h3>
                    <p>
                      {solicitudes.length
                        ? "Prueba otra búsqueda o cambia los filtros."
                        : "Registra la primera solicitud para comenzar."}
                    </p>
                    {solicitudes.length > 0 && (
                      <button
                        className="text-button"
                        onClick={() =>
                          setFiltros({
                            estado: "Todas",
                            prioridad: "Todas",
                            busqueda: "",
                          })
                        }
                      >
                        Restablecer filtros
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
          {!cargando && !error && <SolicitudForm onRegistrar={crear} />}
        </div>
      </main>
      <footer>
        Sistema de Solicitudes de Soporte Técnico
        <span>Servicios Web · Unidad II</span>
      </footer>
    </>
  );
}
