import { useRef, useState } from "react";

const useTurnManager = ({ changeTurn }) => {
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

  };

  /******************************************************************
   * CAMBIO DE TURNO A PLAYER (inmediato)
   ******************************************************************/
  const goToPlayerTurn = () => {
    setHandoverToComputer(false);
    changeTurn("player");

  };

  /******************************************************************
   * CAMBIO DE TURNO A COMPUTER CON DELAY
   * Se usa cuando hay mensaje que debe leerse antes
   ******************************************************************/
  const goToComputerTurnAfter = (ms) => {
    cancelTurnTimeout();
    setHandoverToComputer(true);


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
