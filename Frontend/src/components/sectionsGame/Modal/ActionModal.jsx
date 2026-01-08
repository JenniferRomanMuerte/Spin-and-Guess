import "../../../styles/layout/sectionGame/Modal.scss";
import LetterPicker from "./LetterPicker";
import SolveForm  from "./SolveForm";

const ActionModal = ({
  modalMode,
  vowels,
  consonants,
  handleletterSelected,
  closeModal,
  onSubmitSolve,
  solveResult
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

          {modalMode.type === "solve" && <SolveForm onSubmitSolve= {onSubmitSolve} solveResult={solveResult}  solver={modalMode.solver}/>}

          {modalMode === "joker" && <JokerPanel closeModal={closeModal} />}
        </div>
      </div>
    </section>
  );
};

export default ActionModal;
