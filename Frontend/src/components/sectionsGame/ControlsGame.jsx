import "../../styles/layout/sectionGame/ControlsGame.scss";

import Button from "./ButtonsGame";
const ControlsGame = ({
  controlsDisabled,
  hasJoker,
  updateControlsGame,
  selectedAction,
  canBuyVowel,
}) => {
  return (
    <article className="controls">
      <Button
        disabled={controlsDisabled}
        text="Consonante"
        updateControlsGame={updateControlsGame}
        selectedAction={selectedAction}
      />
      <Button
        disabled={controlsDisabled || !canBuyVowel}
        text="Comprar Vocal"
        updateControlsGame={updateControlsGame}
        selectedAction={selectedAction}
      />
      <Button
        disabled={!hasJoker}
        text="Comodin"
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
