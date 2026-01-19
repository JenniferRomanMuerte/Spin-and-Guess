import "../../../styles/layout/sectionGame/Modal.scss";

const LetterPicker = ({ mode, vowels, consonants, handleletterSelected }) => {
  const letters = mode === "vowel" ? vowels : consonants;

  const handleSelect = (letter) => {
    handleletterSelected(letter, mode);
  };

  return (
    <div className="letterPicker">
      <h2 className="letterPicker__title">
        {mode === "vowel" ? "Elige una vocal" : "Elige una consonante"}
      </h2>

      <ul className="letterPicker__list">
        {letters.map(({ letter, enabled }) => (
          <li key={letter}>
            <button
              className="letterPicker__button"
              disabled={!enabled}
              onClick={() => handleSelect(letter)}
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => e.preventDefault()}
            >
              {letter}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LetterPicker;
