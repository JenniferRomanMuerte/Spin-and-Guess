import "../../styles/layout/sectionGame/ControlsGame.scss";

import Button from "./ButtonsGame";
const ControlsGame = ({
  controlsDisabled,
  hasJocker,
  updateControls,
  selectedAction,
}) => {
  return (
    <article className="controls">
      <Button
        disabled={controlsDisabled}
        text="Consonante"
        updateControls={updateControls}
        selectedAction={selectedAction}
      />
      <Button
        disabled={controlsDisabled}
        text="Vocal"
        updateControls={updateControls}
        selectedAction={selectedAction}
      />
      <Button
        disabled={hasJocker}
        text="Comodin"
        updateControls={updateControls}
        selectedAction={selectedAction}
      />
      <Button
        disabled={controlsDisabled}
        text="Resolver"
        updateControls={updateControls}
        selectedAction={selectedAction}
      />
    </article>
  );
};

export default ControlsGame;
