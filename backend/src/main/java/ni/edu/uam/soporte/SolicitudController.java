package ni.edu.uam.soporte;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class SolicitudController {
  private final SolicitudService servicio;

  public SolicitudController(SolicitudService servicio) {
    this.servicio = servicio;
  }

  public record NuevaSolicitud(
      @NotBlank(message = "La descripción es obligatoria.")
          @Size(min = 5, max = 160, message = "La descripción debe tener entre 5 y 160 caracteres.")
          String titulo,
      @NotBlank
          @Pattern(
              regexp = "Alta|Media|Baja",
              message = "La prioridad debe ser Alta, Media o Baja.")
          String prioridad) {
    public NuevaSolicitud {
      titulo = titulo == null ? null : titulo.strip();
    }
  }

  public record CambioEstado(
      @NotBlank @Pattern(regexp = "Pendiente|En proceso|Resuelta", message = "Estado inválido.")
          String estado) {}

  @GetMapping
  public List<Solicitud> listar() {
    return servicio.listar();
  }

  @PostMapping
  public ResponseEntity<Solicitud> crear(@Valid @RequestBody NuevaSolicitud datos) {
    Solicitud creada = servicio.crear(datos.titulo(), datos.prioridad());
    return ResponseEntity.created(URI.create("/api/solicitudes/" + creada.id())).body(creada);
  }

  @GetMapping("/{id}")
  public Solicitud buscar(@PathVariable long id) {
    return servicio.buscar(id);
  }

  @PatchMapping("/{id}/estado")
  public Solicitud actualizar(@PathVariable long id, @Valid @RequestBody CambioEstado datos) {
    return servicio.cambiarEstado(id, datos.estado());
  }
}
