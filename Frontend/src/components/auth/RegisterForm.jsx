import "../../styles/layout/auth/AuthForm.scss";
import { useState } from "react";
import { isValidEmail } from "../../utils/validators";
import { register } from "../../services/auth.service";

const RegisterForm = ({onRegisterSuccess}) => {
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [errorName, setErrorName] = useState("");
  const [formError, setFormError] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [userName, setUserName] = useState("");

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

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);

    if (formError) setFormError("");
    if (value !== "") {
      setErrorName("");
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    let hasError = false;

    if (userName === "") {
      setErrorName("Debes introducir tu nombre de usuario.");
      hasError = true;
    } else {
      setErrorName("");
    }

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
      const response = await register({
        username: userName,
        email: userEmail,
        pass: userPass,
      });

       setFormError("");
       onRegisterSuccess();
    } catch (error) {
      setFormError(
        error?.error || "Error al crear el usuario. Inténtalo de nuevo."
      );
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        className={`form__input ${errorName ? "is-error" : ""}`}
        placeholder="Introduce tu nombre de usuario"
        value={userName}
        aria-invalid={!!errorName}
        onChange={handleNameChange}
        aria-describedby="name-error"
      />
      {errorName && (
        <p id="name-error" className="form__error" role="alert">
          {errorName}
        </p>
      )}
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
      <input
        type="password"
        className={`form__input ${errorPass ? "is-error" : ""}`}
        placeholder="Introduce tu contraseña"
        value={userPass}
        aria-invalid={!!errorPass}
        onChange={handlePassChange}
        aria-describedby="pass-error"
      />
      {errorPass && (
        <p id="pass-error" className="form__error" role="alert">
          {errorPass}
        </p>
      )}

      <button type="submit" className="form__btn">
        Registrate
      </button>
      {formError && (
        <p className="form__error login__error--general" role="alert">
          {formError}
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
