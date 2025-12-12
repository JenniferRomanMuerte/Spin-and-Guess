import "../../styles/layout/sectionGame/ControlsGame.scss";

const Button = ({text, disabled, updateControls}) => {
  const handleSelectedButton = () =>{
    updateControls({ source: "button", action: text });
  }

  return (
     <button
     className="controls__buttons"
     disabled = {disabled}
     onClick = {handleSelectedButton}
     >
     {text}
     </button>
  );
};

export default Button;