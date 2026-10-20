import { indicadores } from "../domain/solicitudes";
export default function Indicadores({ solicitudes }) {
  const s = indicadores(solicitudes);
  return (
    <section className="metrics" aria-label="Indicadores de todas las solicitudes">
      {[
        ["Total de solicitudes", s.total, "Todas las registradas"],
        ["Pendientes", s.pendientes, "Por atender"],
        ["En proceso", s.proceso, "Atención en curso"],
        ["Resueltas", s.resueltas, `${s.porcentaje}% del total completado`],
      ].map(([nombre, valor, detalle], i) => (
        <article className={`metric metric-${i}`} key={nombre}>
          <span>{nombre}</span>
          <strong>{valor}</strong>
          <small>{detalle}</small>
        </article>
      ))}
    </section>
  );
}
