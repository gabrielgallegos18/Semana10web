package ni.edu.uam.soporte;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> validar(MethodArgumentNotValidException error) {
    String mensaje =
        error.getBindingResult().getFieldErrors().stream()
            .map(campo -> campo.getDefaultMessage())
            .sorted()
            .findFirst()
            .orElse("Datos inválidos.");
    return ResponseEntity.badRequest().body(Map.of("message", mensaje));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<Map<String, String>> jsonInvalido() {
    return ResponseEntity.badRequest()
        .body(Map.of("message", "El cuerpo de la solicitud debe ser un JSON válido."));
  }
}
