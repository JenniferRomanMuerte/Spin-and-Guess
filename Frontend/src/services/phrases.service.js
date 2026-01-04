// Importamos la función genérica para hacer peticiones HTTP
import { request } from "./http";

// ----------------------------
// OBTENER LA FRASE
// ----------------------------

export const getPhrase = () => {
  return request("/api/phrase/random");
};
