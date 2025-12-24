import "../../styles/layout/sectionGame/ControlsGame.scss";

import Button from "./ButtonsGame";
const ControlsGame = ({
  controlsDisabled,
  hasJocker,
  updateControlsGame,
  selectedAction,
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
        disabled={controlsDisabled}
        text="Vocal"
        updateControlsGame={updateControlsGame}
        selectedAction={selectedAction}
      />
      <Button
        disabled={!hasJocker}
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
