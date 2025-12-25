import { useEffect, useRef, useState } from "react";
import "../../styles/layout/sectionGame/RouletteGame.scss";
import { wedges } from "../../data/rouletteWedges";
import {
  calcSliceSize,
  getWinnerIndexFromRotation,
  getRandomSpinDegrees,
} from "../../utils/rouletteUtils";

const Roulette = ({ rouletteDisabled, spinEnd, startSpin }) => {
  /*
  useRef: Referencia al DOM de la rueda (para medir su tamaño real)
  creamos un objeto con la propiedad current en null porque
  al principio aún no está pintado el elemento que queremos guardar aqui.
  Después de renderizar la sección de la ruleta se la  asignamos
  wheelRef.current apuntará a ese elemento
  */
  const wheelRef = useRef(null);

  // Tamaño calculado de cada gajo (triángulo)
  const [sliceSize, setSliceSize] = useState({ width: 0, height: 0 });

  // Grados que ocupa cada gajo
  const degreesPerWedge = 360 / wedges.length;

  // Rotación actual que aplicamos al contenedor que gira (para pintarlo)
  const [rotation, setRotation] = useState(0);

  // Rotación acumulada real (ref para que NO se reinicie en re-renders)
  const rotationRef = useRef(0);

  // Índice del gajo ganador (lo calculamos cuando termina el giro)
  const [winnerIndex, setWinnerIndex] = useState(null);

  // Para saber si la ruleta está girando y así para bloquear clicks
  const [isSpinning, setIsSpinning] = useState(false);

  // Animación visual del indicador (flecha)
  const [indicatorActive, setIndicatorActive] = useState(false);

  //useEffect: calcula el tamaño de los gajos según el tamaño real de la ruleta
  useEffect(() => {
    const updateSizes = () => {
      // Si aún no hay referencia al DOM, salimos (por seguridad)
      if (!wheelRef.current) return;

      // Calcula width/height del triángulo según el ancho de la rueda
      const { width, height } = calcSliceSize(
        wheelRef.current.offsetWidth,
        degreesPerWedge
      );

      // Guardamos el resultado para usarlo en los estilos de cada gajo
      setSliceSize({ width, height });
    };

    //Llamamos una primera vez para calcular tamaños cuando el componente se monta
    updateSizes();

    //Si cambia el tamaño de la ventana, recalculamos tamaños
    window.addEventListener("resize", updateSizes);

    // Limpieza: quitamos el listener al desmontar
    return () => window.removeEventListener("resize", updateSizes);
  }, [degreesPerWedge]);

  // Cuando ya tenemos winnerIndex, le mandamos a GamePage  el gajo ganador
  useEffect(() => {
    if (winnerIndex === null) return;

    const winner = wedges[winnerIndex];
    spinEnd(winner);
  }, [winnerIndex, spinEnd]);

  // Función para girar la ruleta
  const handleSpin = () => {
    // Si ya está girando, ignoramos el click
    if (isSpinning || rouletteDisabled) return;

    // Reseteos previos al giro (mensaje / wedge / etc en GamePage)
    startSpin();

    // Marcamos que empieza el giro y desactivamos el indicador
    setIsSpinning(true);
    setIndicatorActive(false);

    // Llamamos a la funcion para obtener un nº aleatorio para la rotacion
    const extraDegrees = getRandomSpinDegrees(1, 3);

    // Sumamos al acumulado para no "volver atrás" en la animación
    rotationRef.current += extraDegrees;

    // Pintamos la rotación en el DOM
    setRotation(rotationRef.current);

    // Cuando termine la animación, marcamos que ya no está girando
    setTimeout(() => {
      setIsSpinning(false);
      setIndicatorActive(true);

      // Llamamos a la funcion que calcula el índice del gajo según la rotación final
      const index = getWinnerIndexFromRotation(
        rotationRef.current,
        degreesPerWedge,
        wedges.length
      );

      // Guardamos ganador (dispara el useEffect de arriba -> spinEnd(winner))
      setWinnerIndex(index);

      // Apagamos el indicador visual tras 2s
      setTimeout(() => {
        setIndicatorActive(false);
      }, 2000);
    }, 4500); // debe coincidir con la duración de la transición de CSS
  };

  return (
    <section className="roulette">
      {/* Indicador (flecha) arriba de la ruleta */}
      <div
        className={`roulette__indicator ${
          indicatorActive ? "roulette__indicator--active" : ""
        }`}
      ></div>

      {/* Círculo de la ruleta. ref={wheelRef} conecta este elemento con wheelRef.current */}
      <div className="roulette__wheel" id="rouletteWheel" ref={wheelRef}>
        {/* Botón central de "TIRAR" */}
        <button
          id="spinButton"
          className="roulette__wheel--btn"
          onClick={handleSpin}
          disabled={isSpinning || rouletteDisabled}
        >
          TIRAR
        </button>
        {/* Contenedor interno que SÍ gira */}
        <div
          className="roulette__wheelInner"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Solo pintamos gajos si ya hemos calculado un width > 0 */}
          {sliceSize.width > 0 &&
            wedges.map((wedge, index) => (
              <div
                key={`${wedge.label}-${index}`} // clave única para React
                className={`roulette__slice roulette__slice--${wedge.theme}`}
                style={{
                  // tamaño del triángulo calculado en el efecto
                  height: `${sliceSize.height}px`,
                  width: `${sliceSize.width}px`,

                  // rotamos cada gajo su ángulo correspondiente
                  transform: `translateX(-50%) rotate(${
                    index * degreesPerWedge
                  }deg)`,

                  // pasamos variables CSS a los estilos (para usarlas en el SCSS)
                  "--wedge-color": wedge.color,
                  "--slice-width": `${sliceSize.width}px`,
                  "--slice-height": `${sliceSize.height}px`,
                }}
              >
                {/* Texto del gajo, que se pinta siguiendo los estilos de .roulette__label */}
                <span className="roulette__label">{wedge.label}</span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Roulette;
