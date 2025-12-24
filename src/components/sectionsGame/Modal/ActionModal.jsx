import "../../../styles/layout/sectionGame/Modal.scss";
import LetterPicker from "./LetterPicker";

const ActionModal = ({
  actionMode,
  vowels,
  consonants,
  handleletterSelected,
  closeActionMode,
}) => {
  return (
    <section className="modal">
      <div className="modal__overlay">
        <div className="modal__content">
          {(actionMode === "vowel" ||
            actionMode === "consonant") && (
              <LetterPicker
                actionMode={actionMode}
                closeActionMode={closeActionMode}
                vowels={vowels}
                consonants={consonants}
                handleletterSelected={handleletterSelected}
              />
            )}

          {actionMode === "solve" && (
            <SolveForm closeActionMode={closeActionMode} />
          )}

          {actionMode === "jocker" && (
            <JokerPanel closeActionMode={closeActionMode} />
          )}
        </div>
      </div>
    </section>
  );
};

export default ActionModal;
