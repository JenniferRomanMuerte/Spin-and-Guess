// URL base del backend.
// - En desarrollo se toma de VITE_API_URL (archivo .env de Vite)
// - Si no existe, usamos localhost:3000 por defecto
// Esto permite cambiar la URL del backend sin tocar el código.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Función genérica para hacer peticiones HTTP al backend.
// Centraliza el uso de fetch para no repetir código en toda la app.
export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  // Realizamos la petición HTTP usando fetch.
  // - La URL final se construye con la URL base + el endpoint concreto.
  // - options contiene method, body, headers, etc. (igual que fetch).
  const response = await fetch(`${API_URL}${endpoint}`, {
    // Headers comunes a todas las peticiones.
    // Siempre indicamos que enviamos/recibimos JSON.
    // Si options trae headers adicionales, se mezclan aquí.
    headers: {
      "Content-Type": "application/json",
      // Header por defecto (si hay token)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      // ✅ Si el caller pasa headers, se mezclan y pueden sobrescribir
      ...options.headers,
    },

    // Se propagan el resto de opciones:
    // method, body, credentials, etc.
    ...options,
  });

  // Convertimos la respuesta del backend a JSON.
  const data = await response.json();

  // Si la respuesta HTTP no es correcta,
  // lanzamos un error con los datos devueltos por el backend.
  if (!response.ok) {
    throw data;
  }

  // Si todo ha ido bien, devolvemos directamente los datos.
  return data;
};
