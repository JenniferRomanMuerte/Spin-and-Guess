import "../../../styles/layout/sectionGame/Modal.scss";
import VowelPicker from "./VowelPicker";

const ActionModal = ({ actionMode, closeActionMode }) => {
  return (
    <section className="modal">
      <div className="modal__overlay">
        <div className="modal__content">
          {actionMode === "vowel" && <VowelPicker closeActionMode = {closeActionMode}/>}

          {actionMode === "Consonante" && <ConsonantPicker closeActionMode = {closeActionMode}/>}

          {actionMode === "Resolver" && <SolveForm closeActionMode = {closeActionMode}/>}

          {actionMode === "Comodin" && <JokerPanel closeActionMode = {closeActionMode}/>}
        </div>
      </div>
    </section>
  );
};

export default ActionModal;
