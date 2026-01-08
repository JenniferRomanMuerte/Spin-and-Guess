import { useState } from "react";

const useGameUI = ({
  resetQueue,
  cancelTurnTimeout,
  turn,
  handoverToComputer,
}) => {
  /******************************************************************
   * ESTADO DE UI
   ******************************************************************/
  const [controlsDisabled, setControlsDisabled] = useState(true);
  const [rouletteDisabled, setRouletteDisabled] = useState(false);
  const [modalMode, setModalMode] = useState(null);

  /******************************************************************
   * HELPERS DE UI
   ******************************************************************/

  // Bloquea toda interacción
  const lockUI = () => {
    setControlsDisabled(true);
    setRouletteDisabled(true);
  };

 // Permite girar la ruleta (pero no usar controles)
  const enableSpinOnly  = () => {
    setControlsDisabled(false);
    setRouletteDisabled(true);
  };

  /******************************************************************
   * BOTONES DE ControlsGame
   ******************************************************************/
  const updateControlsGame = ({ text }) => {
    // Al pulsar cualquier botón, bloqueamos controles
    setControlsDisabled(true);

    if (text === "Comodin") {
      setModalMode("joker");
      return;
    }

    if (text === "Comprar Vocal") {
      setModalMode("vowel");
      return;
    }

    if (text === "Consonante") {
      setModalMode("consonant");
      return;
    }

    if (text === "Resolver") {
      setModalMode("solve");
      return;
    }
  };

  /******************************************************************
   * MODAL: cerrar
   * - Cierra el modal activo
   * - Decide si el jugador puede volver a girar la ruleta
   ******************************************************************/
  const closeModal = () => {
    setModalMode(null);
    setControlsDisabled(true);

    // Solo permitimos girar si:
    // - no es turno de la computer
    // - no estamos en transición de turno
    if (turn !== "computer" && !handoverToComputer) {
      setRouletteDisabled(false);
    }
  };

  /******************************************************************
   * INICIO DE GIRO DE RULETA
   * Se ejecuta justo cuando la ruleta empieza a girar
   ******************************************************************/
  const startSpin = () => {
    // Cancelamos cualquier cambio de turno pendiente
    cancelTurnTimeout();

    // Bloqueamos toda interacción durante el giro
    lockUI();
    setModalMode(null);

    // Limpiamos mensajes
    resetQueue();

  };
  return {
    controlsDisabled,
    rouletteDisabled,
    modalMode,

    updateControlsGame,
    closeModal,
    startSpin,

    lockUI,
    enableSpinOnly ,
    setModalMode,
  };
};

export default useGameUI;
