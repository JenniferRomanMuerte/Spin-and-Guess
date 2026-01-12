import {useEffect, useState } from "react";

const UI_PHASES = {
    LOCKED: "LOCKED", // nada se puede usar
    SPIN_ONLY: "SPIN_ONLY", // solo ruleta
    ACTIONS: "ACTIONS", // solo botones
  };

const useGameUI = ({
  resetQueue,
  cancelTurnTimeout,
  turn,
  handoverToComputer,
}) => {
  /******************************************************************
   * ESTADO ÚNICO DE UI
   ******************************************************************/
  const [uiPhase, setUiPhase] = useState(UI_PHASES.LOCKED);
  const [modalMode, setModalMode] = useState(null);

  /******************************************************************
   * ESTADO DERIVADO (NO se setea a mano)
   ******************************************************************/
  const rouletteDisabled = uiPhase !== UI_PHASES.SPIN_ONLY;
  const controlsDisabled = uiPhase !== UI_PHASES.ACTIONS;

  useEffect(() => {
  if (turn === "computer" || handoverToComputer) {
      setUiPhase(UI_PHASES.LOCKED);
      return;
    }

    if (turn === "player") {
      setUiPhase(UI_PHASES.SPIN_ONLY);
    }
}, [turn, handoverToComputer]);


  /******************************************************************
   * HELPERS DE UI
   ******************************************************************/

  // Bloquea toda interacción
  const lockUI = () => {
    setUiPhase(UI_PHASES.LOCKED);
  };

  // Turno jugador: puede girar
  const enableSpinOnly = () => {
    setUiPhase(UI_PHASES.SPIN_ONLY);
  };

  // Jugador ha caído en gajo puntuable: puede elegir acción
  const enableActions = () => {
    setUiPhase(UI_PHASES.ACTIONS);
  };

  /******************************************************************
   * BOTONES DE ControlsGame
   ******************************************************************/
  const updateControlsGame = ({ text }) => {
    // Al pulsar un botón, cerramos interacción hasta resolver acción
    lockUI();

    if (text === "Comodin") {
      setModalMode( { type: "joker" });
      return;
    }

    if (text === "Comprar Vocal") {
      setModalMode({ type: "vowel" });
      return;
    }

    if (text === "Consonante") {
      setModalMode({ type: "consonant" });
      return;
    }

    if (text === "Resolver") {
      setModalMode({ type: "solve", solver: "player" });
      return;
    }
  };

  /******************************************************************
   * MODAL: cerrar
   ******************************************************************/
  const closeModal = () => {
    setModalMode(null);

    // Si sigue siendo turno del jugador, puede volver a girar
    if (turn === "player" && !handoverToComputer) {
      enableSpinOnly();
    } else {
      lockUI();
    }
  };

  /******************************************************************
   * INICIO DE GIRO DE RULETA
   ******************************************************************/
  const startSpin = () => {
    cancelTurnTimeout();
    resetQueue();
    lockUI();
    setModalMode(null);
  };

  /******************************************************************
   * API pública del hook
   ******************************************************************/
  return {
    // estado derivado
    controlsDisabled,
    rouletteDisabled,
    modalMode,

    // acciones UI
    updateControlsGame,
    closeModal,
    startSpin,

    // helpers usados desde GamePage
    lockUI,
    enableSpinOnly,
    enableActions,
    setModalMode,
  };
};

export default useGameUI;