import "../../../styles/layout/sectionGame/Modal.scss";
import LetterPicker from "./LetterPicker";
import SolveForm from "./SolveForm";
import RiskPanel from "./RiskPanel";
import JokerPanel from "./JokerPanel";

const ActionModal = ({
  modalMode,
  vowels,
  consonants,
  handleletterSelected,
  closeModal,
  onSubmitSolve,
  solveResult,
  resolveRisk,
  onReplay,
  onExit,
  resolveJoker,
  jockerPlayerCount,
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

          {modalMode.type === "solve" && (
            <SolveForm
              onSubmitSolve={onSubmitSolve}
              solveResult={solveResult}
              solver={modalMode.solver}
              onReplay={onReplay}
              onExit={onExit}
            />
          )}

          {modalMode === "risk" && <RiskPanel resolveRisk={resolveRisk} />}

          {modalMode.type === "joker" && (
            <JokerPanel
              resolveJoker={resolveJoker}
              jockerPlayerCount={jockerPlayerCount}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ActionModal;
