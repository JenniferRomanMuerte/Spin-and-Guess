import "../../../styles/layout/sectionGame/Modal.scss";

const VowelPicker = ({ closeActionMode }) => {
  const vowels = ["A", "E", "I", "O", "U"];

  const handleSelect = vowel => {
    console.log("Vocal elegida:", vowel);
    closeActionMode();
  };

  return (
    <div className="vowelPicker">
      <h2 className="vowelPicker__title">Elige una vocal</h2>

      <ul className="vowelPicker__list">
        {vowels.map(vowel => (
          <li key={vowel}>
            <button
              className="vowelPicker__button"
              onClick={() => handleSelect(vowel)}
            >
              {vowel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VowelPicker;
