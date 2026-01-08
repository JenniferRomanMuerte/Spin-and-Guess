import { useRef, useState } from "react";

const useTurnManager = ({
  changeTurn,
    setControlsDisabled,
    setRouletteDisabled,
    setModalMode,
}) => {

  // Timeout para retrasar el cambio de turno (para que se vea el mensaje)
  const turnTimeoutRef = useRef(null);

  // Indica que estamos entregando turno (bloquea acciones)
  const [handoverToComputer, setHandoverToComputer] = useState(false);

  /******************************************************************
   * TURN HELPERS
   ******************************************************************/
  // Cancela cualquier cambio de turno pendiente
  const cancelTurnTimeout = () => {
    if (turnTimeoutRef.current) {
      clearTimeout(turnTimeoutRef.current);
      turnTimeoutRef.current = null;
    }
  };

  /******************************************************************
   * CAMBIO DE TURNO A COMPUTER (inmediato)
   ******************************************************************/
  const goToComputerTurn = () => {
    setHandoverToComputer(false);
    changeTurn("computer");
    setControlsDisabled(true);
    setRouletteDisabled(true);
  };

  /******************************************************************
   * CAMBIO DE TURNO A PLAYER (inmediato)
   ******************************************************************/
  const goToPlayerTurn = () => {
    setHandoverToComputer(false);
    changeTurn("player");
    setControlsDisabled(true);
    setRouletteDisabled(false);
  };

  /******************************************************************
   * CAMBIO DE TURNO A COMPUTER CON DELAY
   * Se usa cuando hay mensaje que debe leerse antes
   ******************************************************************/
  const goToComputerTurnAfter = (ms) => {
    cancelTurnTimeout();

    setHandoverToComputer(true);
    setControlsDisabled(true);
    setRouletteDisabled(true);
    setModalMode(null);

    turnTimeoutRef.current = setTimeout(() => {
      setHandoverToComputer(false);
      goToComputerTurn();
    }, ms);
  };

  return {
    handoverToComputer,
    goToPlayerTurn,
    goToComputerTurn,
    goToComputerTurnAfter,
    cancelTurnTimeout,
  };
};

export default useTurnManager;
