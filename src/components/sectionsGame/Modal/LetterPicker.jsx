import "../../../styles/layout/sectionGame/Modal.scss";

const LetterPicker = ({
  modalMode,
  closeModal,
  vowels,
  consonants,
  handleletterSelected,
}) => {
  const letters = modalMode === "vowel" ? vowels : consonants;

  const handleSelect = (letter) => {
    handleletterSelected(letter, modalMode);
    closeModal();
  };

  return (
    <div className="letterPicker">
      <h2 className="letterPicker__title">
        {modalMode === "vowel" ? "Elige una vocal" : "Elige una consonante"}
      </h2>

      <ul className="letterPicker__list">
        {letters.map(({ letter, enabled }) => (
          <li key={letter}>
            <button
              className="letterPicker__button"
              disabled={!enabled}
              onClick={() => handleSelect(letter)}
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
