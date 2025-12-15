import "../../styles/layout/sectionGame/ControlsGame.scss";

import Button from "./ButtonsGame";
const ControlsGame = ({choose, hasJocker, updateControls, selectedAction}) => {

  return (
    <article className="controls">
      <Button disabled = {choose} text="Consonante" updateControls={updateControls} selectedAction={selectedAction}/>
      <Button disabled = {choose} text="Vocal" updateControls={updateControls} selectedAction={selectedAction}/>
      <Button disabled = {hasJocker} text="Comodin" updateControls={updateControls} selectedAction={selectedAction}/>
      <Button disabled = {choose} text="Resolver" updateControls={updateControls} selectedAction={selectedAction}/>
    </article>
  );
};

export default ControlsGame;
