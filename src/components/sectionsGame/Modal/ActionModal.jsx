import "../../../styles/layout/sectionGame/Modal.scss";
import LetterPicker from "./LetterPicker";

const ActionModal = ({
  modalMode,
  vowels,
  consonants,
  handleletterSelected,
  closeModal,
}) => {
  return (
    <section className="modal">
      <div className="modal__overlay">
        <div className="modal__content">
          {(modalMode === "vowel" || modalMode === "consonant") && (
            <LetterPicker
              modalMode={modalMode}
              closeModal={closeModal}
              vowels={vowels}
              consonants={consonants}
              handleletterSelected={handleletterSelected}
            />
          )}

          {modalMode === "solve" && <SolveForm closeModal={closeModal} />}

          {modalMode === "joker" && <JokerPanel closeModal={closeModal} />}
        </div>
      </div>
    </section>
  );
};

export default ActionModal;
