package ni.edu.uam.soporte;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SolicitudControllerTest {
  @Autowired MockMvc mvc;

  @Test
  void listarSolicitudes() throws Exception {
    mvc.perform(get("/api/solicitudes"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].titulo").value("Equipo no enciende"));
  }

  @Test
  void registrarYResolver() throws Exception {
    var resultado =
        mvc.perform(
                post("/api/solicitudes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"titulo\":\"Prueba de registro\",\"prioridad\":\"Alta\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.estado").value("Pendiente"))
            .andReturn();
    String ubicacion = resultado.getResponse().getHeader("Location");
    mvc.perform(get(ubicacion))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.titulo").value("Prueba de registro"));
    mvc.perform(
            patch(ubicacion + "/estado")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"estado\":\"Resuelta\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.estado").value("Resuelta"));
  }

  @Test
  void rechazarDatosInvalidos() throws Exception {
    for (String titulo : new String[] {"", "   ", "abc", "    abc    "}) {
      mvc.perform(
              post("/api/solicitudes")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"titulo\":\"" + titulo + "\",\"prioridad\":\"Alta\"}"))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.message").isString());
    }
    mvc.perform(
            post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"titulo\":\"Solicitud válida\",\"prioridad\":\"Urgente\"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void responder404ParaSolicitudInexistente() throws Exception {
    mvc.perform(
            patch("/api/solicitudes/999999/estado")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"estado\":\"Resuelta\"}"))
        .andExpect(status().isNotFound());
  }

  @Test
  void permitirOrigenFrontend() throws Exception {
    mvc.perform(
            options("/api/solicitudes")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
  }

  @Test
  @DisplayName("POST elimina espacios exteriores y conserva el título normalizado")
  void normalizarDescripcion() throws Exception {
    mvc.perform(
            post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"titulo\":\"  Revisar equipo  \",\"prioridad\":\"Baja\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.titulo").value("Revisar equipo"));
  }

  @Test
  @DisplayName("POST rechaza campos ausentes, nulos y descripciones demasiado largas")
  void rechazarCamposAusentesYLongitud() throws Exception {
    for (String cuerpo :
        new String[] {
          "{}",
          "{\"titulo\":null,\"prioridad\":\"Alta\"}",
          "{\"titulo\":\"Revisar equipo\"}",
          "{\"titulo\":\"" + "a".repeat(161) + "\",\"prioridad\":\"Alta\"}"
        }) {
      mvc.perform(post("/api/solicitudes").contentType(MediaType.APPLICATION_JSON).content(cuerpo))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.message").isString());
    }
  }

  @Test
  @DisplayName("POST acepta los límites de 5 y 160 caracteres")
  void aceptarLongitudesLimite() throws Exception {
    for (int longitud : new int[] {5, 160}) {
      mvc.perform(
              post("/api/solicitudes")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"titulo\":\"" + "a".repeat(longitud) + "\",\"prioridad\":\"Media\"}"))
          .andExpect(status().isCreated());
    }
  }

  @Test
  @DisplayName("Un JSON mal formado produce 400 con mensaje legible")
  void rechazarJsonMalFormado() throws Exception {
    mvc.perform(
            post("/api/solicitudes").contentType(MediaType.APPLICATION_JSON).content("{invalid"))
        .andExpect(status().isBadRequest())
        .andExpect(
            jsonPath("$.message").value("El cuerpo de la solicitud debe ser un JSON válido."));
  }

  @Test
  @DisplayName("PATCH rechaza un estado inválido sin modificar la solicitud")
  void rechazarEstadoInvalido() throws Exception {
    mvc.perform(
            patch("/api/solicitudes/1/estado")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"estado\":\"Cancelada\"}"))
        .andExpect(status().isBadRequest());
    mvc.perform(get("/api/solicitudes/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.estado").value("Pendiente"));
  }

  @Test
  @DisplayName("GET de un identificador inexistente produce 404")
  void consultarSolicitudInexistente() throws Exception {
    mvc.perform(get("/api/solicitudes/999999")).andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("CORS permite PATCH desde el frontend y rechaza orígenes no autorizados")
  void comprobarCorsPatch() throws Exception {
    mvc.perform(
            options("/api/solicitudes/1/estado")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "PATCH"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    mvc.perform(
            options("/api/solicitudes")
                .header("Origin", "https://ejemplo.invalid")
                .header("Access-Control-Request-Method", "POST"))
        .andExpect(status().isForbidden());
  }
}
