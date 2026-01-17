import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/validators";
import { login } from "../../services/auth.service";
import storage from "../../services/localStorage";
import "../../styles/layout/auth/AuthForm.scss";

const LoginForm = ({ changeNamePlayer }) => {
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [formError, setFormError] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");

  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUserEmail(value);

    if (formError) setFormError("");
    if (errorEmail && isValidEmail(value)) {
      setErrorEmail("");
    }
  };

  const handlePassChange = (e) => {
    const value = e.target.value;
    setUserPass(value);

    if (formError) setFormError("");
    if (value !== "") {
      setErrorPass("");
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    let hasError = false;

    if (!isValidEmail(userEmail)) {
      setErrorEmail("Debes introducir un email valido para continuar.");
      hasError = true;
    } else {
      setErrorEmail("");
    }

    if (userPass === "") {
      setErrorPass("Debes introducir tu contraseña.");
      hasError = true;
    } else {
      setErrorPass("");
    }
    if (hasError) return;

    try {
      const response = await login({
        email: userEmail,
        pass: userPass,
      });

      storage.set("token", response.token);
      storage.set("user", response.user);

      changeNamePlayer(response.user.username);

      navigate("/game");
    } catch (error) {
      setFormError(
        error?.error || "Error al iniciar sesión. Inténtalo de nuevo."
      );
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        className={`form__input ${errorEmail ? "is-error" : ""}`}
        placeholder="Introduce tu email"
        value={userEmail}
        onChange={handleEmailChange}
        aria-invalid={!!errorEmail}
        aria-describedby="email-error"
      />
      {errorEmail && (
        <p id="email-error" className="form__error" role="alert">
          {errorEmail}
        </p>
      )}
      <div className="form__password">
        <input
          type={showPass ? "text" : "password"}
          className={`form__input form__input--withIcon ${
            errorPass ? "is-error" : ""
          }`}
          placeholder="Introduce tu contraseña"
          value={userPass}
          aria-invalid={!!errorPass}
          onChange={handlePassChange}
          aria-describedby="pass-error"
          autoComplete="current-password"
        />

        <button
          type="button"
          className="form__togglePass"
          onClick={() => setShowPass((v) => !v)}
          aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
          title={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPass ? "🙈" : "👁️"}
        </button>
      </div>

      {errorPass && (
        <p id="pass-error" className="form__error" role="alert">
          {errorPass}
        </p>
      )}
      <button type="submit" className="form__btn">
        A jugar!
      </button>
      {formError && (
        <p className="form__error login__error--general" role="alert">
          {formError}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
