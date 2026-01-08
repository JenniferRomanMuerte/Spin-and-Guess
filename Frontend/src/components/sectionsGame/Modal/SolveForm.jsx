import { useRef } from "react";

const SolveForm = ({ onSubmitSolve, solveResult, solver = "player" }) => {
  const inputRef = useRef(null);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const value = inputRef.current?.value ?? "";
    const phrase = value.trim();

    if (!phrase) return;

    onSubmitSolve(phrase);
  };
  return (
    <>
      {solver === "player" && solveResult === null && (
        <form onSubmit={handleSubmit}>
          <div className="solveForm">
            <label htmlFor="solve" className="solveForm__title">
              Introduce la frase
            </label>
            <input
              id="solve"
              type="text"
              ref={inputRef}
              autoFocus
              className="solveForm__input"
            />
            <button type="submit" className="solveForm__btn">
              Resolver
            </button>
          </div>
        </form>
      )}

      {solveResult === true && (
        <div className="solveForm">
          <p className="solveForm__solveResult">
            {" "}
            {solver === "player"
              ? "✅ ¡Has ganado!"
              : "❌ Has perdido. La computadora ha acertado 🤖"}
          </p>
        </div>
      )}
      {solveResult === false && (
        <div className="solveForm">
          <p className="solveForm__solveResult">
            {solver === "player"
              ? "❌ Has fallado."
              : "😮‍💨 La computadora ha fallado al resolver"}
          </p>
        </div>
      )}
    </>
  );
};

export default SolveForm;
