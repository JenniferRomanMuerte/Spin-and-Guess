// Importamos la función genérica para hacer peticiones HTTP
import { request } from "./http";

/**
 * Guarda una partida ganada por el jugador
 */
export const saveGame = ({score, phraseId, result}) => {
  return request("/api/game", {
    method: "POST",
    body: JSON.stringify({ score, phraseId, result }),
  });
};

/**
 * Obtiene el ranking global
 */
export const getRanking = () => {
  return request("/api/game/ranking");
};

/**
 * Obtiene las últimas partidas jugadas
 */
export const getLastGames = () => {
  return request("/api/game/last");
};

/**
 * Obtiene estadísticas del usuario actual
 */
export const getUserStats = () => {
  return request("/api/game/me/stats");
};
