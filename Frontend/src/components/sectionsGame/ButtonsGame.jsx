import "../../styles/layout/sectionGame/ControlsGame.scss";

const Button = ({ text, disabled, updateControlsGame }) => {
  const handleSelectedButton = () => {
    updateControlsGame({ text });
  };

  return (
    <button
      className="controls__buttons"
      disabled={disabled}
      onClick={handleSelectedButton}
    >
      {text}
    </button>
  );
};

export default Button;
