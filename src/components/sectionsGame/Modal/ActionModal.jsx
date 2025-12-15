const ActionModal = () => {
   return (
    <div className="actionModal">
      <div className="actionModal__backdrop" onClick={onClose} />
      <div className="actionModal__content">
        {mode === "Vocal" && (
          <VowelPicker wedge={wedgeResult} onClose={onClose} />
        )}

        {mode === "Consonante" && (
          <ConsonantPicker wedge={wedgeResult} onClose={onClose} />
        )}

        {mode === "Resolver" && (
          <SolveForm wedge={wedgeResult} onClose={onClose} />
        )}

        {mode === "Comodin" && (
          <JokerPanel wedge={wedgeResult} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default ActionModal;