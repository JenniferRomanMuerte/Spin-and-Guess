// Importamos la función genérica para hacer peticiones HTTP
import { request } from "./http";

// ----------------------------
// OBTENER LA FRASE
// ----------------------------

export const getPhrase = (token) => {
  return request("/api/phrases",{
     headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
