// Importamos la función genérica para hacer peticiones HTTP
import { request } from "./http";

export const markPhraseAsPlayed = (phraseId) => {
  return request("/api//user-phrases", {
    method: "POST",
    body: JSON.stringify({ phraseId }),
  });
};
