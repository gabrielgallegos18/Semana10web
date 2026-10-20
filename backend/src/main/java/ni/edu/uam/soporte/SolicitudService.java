package ni.edu.uam.soporte;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SolicitudService {
  private final ConcurrentHashMap<Long, Solicitud> solicitudes = new ConcurrentHashMap<>();
  private final AtomicLong secuencia = new AtomicLong();

  public SolicitudService() {
    crear("Equipo no enciende", "Alta");
    Solicitud software = crear("Instalar software de diseño", "Media");
    cambiarEstado(software.id(), "En proceso");
    crear("Conexión intermitente a la red", "Alta");
    Solicitud correo = crear("Configurar correo institucional", "Baja");
    cambiarEstado(correo.id(), "Resuelta");
  }

  public List<Solicitud> listar() {
    return solicitudes.values().stream().sorted(Comparator.comparingLong(Solicitud::id)).toList();
  }

  public Solicitud buscar(long id) {
    Solicitud solicitud = solicitudes.get(id);
    if (solicitud == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La solicitud no existe.");
    }
    return solicitud;
  }

  public Solicitud crear(String titulo, String prioridad) {
    long id = secuencia.incrementAndGet();
    Solicitud solicitud = new Solicitud(id, titulo.strip(), prioridad, "Pendiente");
    solicitudes.put(id, solicitud);
    return solicitud;
  }

  public Solicitud cambiarEstado(long id, String estado) {
    return solicitudes.compute(
        id,
        (clave, anterior) -> {
          if (anterior == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La solicitud no existe.");
          }
          return new Solicitud(id, anterior.titulo(), anterior.prioridad(), estado);
        });
  }
}
