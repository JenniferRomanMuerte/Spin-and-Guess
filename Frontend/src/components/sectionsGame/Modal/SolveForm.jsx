import { useRef } from "react";

const SolveForm = ({
  onSubmitSolve,
  solveResult,
  solver = "player",
  onReplay,
  onExit,
}) => {
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
          <p className="solveForm__question">¿Quieres jugar otra ronda?</p>

          <div className="solveForm__actions">
            <button className="solveForm__actions--btn" onClick={onReplay}>
              Sigo Jugando
            </button>

            <button
              className="solveForm__actions--btn"
              onClick={onExit}
            >
              No, lo dejo.
            </button>
          </div>
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
