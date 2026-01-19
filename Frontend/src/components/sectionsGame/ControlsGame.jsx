import "../../styles/layout/sectionGame/ControlsGame.scss";

import Button from "./ButtonsGame";
const ControlsGame = ({
  controlsDisabled,
  updateControlsGame,
  selectedAction,
  canBuyVowel,
  hasAvailableVowels,
  hasAvailableConsonants
}) => {
  return (
    <article className="controls">
      <Button
        disabled={controlsDisabled || !hasAvailableConsonants}
        text={hasAvailableConsonants ? "Consonante" : "Consonante ❌"}
        updateControlsGame={updateControlsGame}
        selectedAction={selectedAction}
      />
      <Button
        disabled={controlsDisabled || !canBuyVowel}
        text= {hasAvailableVowels ? "Comprar Vocal" : "Comprar Vocal ❌"}
        updateControlsGame={updateControlsGame}
        selectedAction={selectedAction}
      />
      <Button
        disabled={controlsDisabled}
        text="Resolver"
        updateControlsGame={updateControlsGame}
        selectedAction={selectedAction}
      />
    </article>
  );
};

export default ControlsGame;
