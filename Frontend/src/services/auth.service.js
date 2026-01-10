// Importamos la función genérica para hacer peticiones HTTP
import { request } from "./http";

// ----------------------------
// REGISTRO DE USUARIO
// ----------------------------

// Envía los datos de registro al backend.
// userData es un objeto con: username, email, pass
export const register = (userData) => {
  return request("/api/user/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// ----------------------------
// LOGIN DE USUARIO
// ----------------------------

// Envía las credenciales al backend.
// credentials es un objeto con: email, pass
// Devuelve el token JWT si el login es correcto.
export const login = (credentials) => {
  return request("/api/user/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// ----------------------------
// COMPROBAR SESIÓN
// ----------------------------

// Comprueba si el token es válido y devuelve el usuario
export const me = () => {
  return request("/api/user/me");
};
