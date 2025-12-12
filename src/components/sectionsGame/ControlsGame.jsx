import "../../styles/layout/sectionGame/ControlsGame.scss";

import Button from "./ButtonsGame";
const ControlsGame = ({choose, hasJocker, updateControls}) => {

  return (
    <article className="controls">
      <Button disabled = {choose} text="Consonante" updateControls={updateControls}/>
      <Button disabled = {choose} text="Vocal" updateControls={updateControls}/>
      <Button disabled = {hasJocker} text="Comodin" updateControls={updateControls} />
      <Button disabled = {choose} text="Resolver" updateControls={updateControls}/>
    </article>
  );
};

export default ControlsGame;
