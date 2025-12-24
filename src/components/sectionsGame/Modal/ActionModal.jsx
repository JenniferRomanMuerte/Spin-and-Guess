import "../../../styles/layout/sectionGame/Modal.scss";
import LetterPicker from "./LetterPicker";

const ActionModal = ({
  modalMode,
  vowels,
  consonants,
  handleletterSelected,
  closemodalMode,
}) => {
  return (
    <section className="modal">
      <div className="modal__overlay">
        <div className="modal__content">
          {(modalMode === "vowel" || modalMode === "consonant") && (
            <LetterPicker
              modalMode={modalMode}
              closemodalMode={closemodalMode}
              vowels={vowels}
              consonants={consonants}
              handleletterSelected={handleletterSelected}
            />
          )}

          {modalMode === "solve" && (
            <SolveForm closemodalMode={closemodalMode} />
          )}

          {modalMode === "jocker" && (
            <JokerPanel closemodalMode={closemodalMode} />
          )}
        </div>
      </div>
    </section>
  );
};

export default ActionModal;
