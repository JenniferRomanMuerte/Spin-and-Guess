import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import "../../styles/layout/sectionGame/RouletteGame.scss";
import { wedges } from "../../data/rouletteWedges";
import {
  calcSliceSize,
  getWinnerIndexFromRotation,
  getRandomSpinDegrees,
} from "../pages/GamePage/utils/rouletteUtils";

const Roulette = forwardRef(
  ({ rouletteDisabled, spinEnd, startSpin, blockUserSpin }, ref) => {
    /******************************************************************
     * REFS (no provocan re-render)
     ******************************************************************/
    // Referencia al DOM real de la ruleta (para medir tamaño y calcular gajos)
    const wheelRef = useRef(null);

    // Guardamos SIEMPRE el último spinEnd en un ref
    // Esto evita problemas de closures si spinEnd cambia entre renders
    const spinEndRef = useRef(spinEnd);

    // Rotación acumulada (no queremos que se reinicie cuando el componente re-renderiza)
    const rotationRef = useRef(0);

    // Opcional: si quisieras limpiar timeouts en unmount
    // (ahora mismo no es estrictamente necesario, pero lo dejo preparado)
    const timeoutsRef = useRef([]);

    /******************************************************************
     * ESTADO DE UI (sí provoca re-render)
     ******************************************************************/
    // Tamaño calculado de cada gajo (triángulo)
    const [sliceSize, setSliceSize] = useState({ width: 0, height: 0 });

    // Rotación actual aplicada al contenedor que gira (para pintar en pantalla)
    const [rotation, setRotation] = useState(0);

    // Índice del gajo ganador (cuando termina el giro)
    const [winnerIndex, setWinnerIndex] = useState(null);

    // Bloqueo: “está girando ahora mismo”
    const [isSpinning, setIsSpinning] = useState(false);

    // Animación visual del indicador (flecha)
    const [indicatorActive, setIndicatorActive] = useState(false);

    /******************************************************************
     * DERIVADOS (no estado, solo cálculos)
     ******************************************************************/
    // Grados que ocupa cada gajo
    const degreesPerWedge = 360 / wedges.length;

    // Busy significa: aunque NO esté girando, el botón debe estar bloqueado
    // (porque está deshabilitada por el padre o porque es turno de la compu)
    const isBusy = rouletteDisabled || blockUserSpin;

    // Duración de la animación (debe coincidir con el CSS)
    const SPIN_DURATION_MS = 4500;

    /******************************************************************
     * EFECTO: calcular tamaño de gajos en base al tamaño real de la ruleta
     ******************************************************************/
    useEffect(() => {
      const updateSizes = () => {
        if (!wheelRef.current) return;

        // Calcula width/height del triángulo según el ancho del círculo
        const { width, height } = calcSliceSize(
          wheelRef.current.offsetWidth,
          degreesPerWedge
        );

        setSliceSize({ width, height });
      };

      // Primera medida al montar
      updateSizes();

      // Recalcular al redimensionar ventana
      window.addEventListener("resize", updateSizes);

      // Limpieza
      return () => window.removeEventListener("resize", updateSizes);
    }, [degreesPerWedge]);

    /******************************************************************
     * EFECTO: mantener spinEnd actualizado dentro del ref
     ******************************************************************/
    useEffect(() => {
      spinEndRef.current = spinEnd;
    }, [spinEnd]);

    /******************************************************************
     * EFECTO: cuando tenemos winnerIndex, llamamos a spinEnd(winner)
     ******************************************************************/
    useEffect(() => {
      if (winnerIndex === null) return;

      const winner = wedges[winnerIndex];

      // Llamamos al último spinEnd guardado (evita closures viejos)
      spinEndRef.current(winner);
    }, [winnerIndex]);

    /******************************************************************
     * FUNCIÓN PRINCIPAL: girar la ruleta
     * - force=true: permite girar aunque rouletteDisabled esté en true (para la compu)
     ******************************************************************/
    const handleSpin = ({ force = false } = {}) => {
      // Si ya está girando, ignoramos
      if (isSpinning) return;

      // Si NO es forzado, bloqueamos por reglas del padre (disabled o turno compu)
      if (!force && (rouletteDisabled || blockUserSpin)) return;

      // Avisamos al padre: empieza giro (limpia mensajes y wedge)
      startSpin?.();

      // IMPORTANTE:
      // Si sale dos veces seguidas el mismo index, React podría no disparar el efecto,
      // así que reseteamos winnerIndex al comenzar el giro.
      setWinnerIndex(null);

      // Marcamos giro en marcha y apagamos el indicador
      setIsSpinning(true);
      setIndicatorActive(false);

      // Generamos rotación aleatoria (vueltas extra)
      const extraDegrees = getRandomSpinDegrees(1, 3);

      // Sumamos al acumulado para que la animación no “vuelva atrás”
      rotationRef.current += extraDegrees;

      // Pintamos la rotación en el DOM
      setRotation(rotationRef.current);

      // Cuando termine la transición CSS, calculamos ganador y desbloqueamos
      const t1 = setTimeout(() => {
        setIndicatorActive(true);

        // Calculamos el índice ganador según rotación final
        const index = getWinnerIndexFromRotation(
          rotationRef.current,
          degreesPerWedge,
          wedges.length
        );

        // Guardamos ganador (dispara el useEffect -> spinEnd(winner))
        setWinnerIndex(index);

        // Marcamos que deja de girar (0ms para soltarlo al final del callstack)
        const t2 = setTimeout(() => setIsSpinning(false), 0);

        // Apagamos indicador tras 2s (solo visual)
        const t3 = setTimeout(() => setIndicatorActive(false), 2000);

        // Guardamos timeouts por si quieres limpiar en unmount (opcional)
        timeoutsRef.current.push(t2, t3);
      }, SPIN_DURATION_MS);

      timeoutsRef.current.push(t1);
    };

    /******************************************************************
     * EXPONER MÉTODOS AL PADRE (GamePage) MEDIANTE REF
     ******************************************************************/
    useImperativeHandle(ref, () => ({
      // GamePage puede hacer: rouletteRef.current.spin()
      // Aquí forzamos el giro incluso si está deshabilitada (para la computadora)
      spin: () => handleSpin({ force: true }),
    }));

    /******************************************************************
     * (Opcional) Limpieza de timeouts al desmontar
     * Evita warnings si el componente desaparece a mitad de animación.
     ******************************************************************/
    useEffect(() => {
      return () => {
        timeoutsRef.current.forEach((t) => clearTimeout(t));
        timeoutsRef.current = [];
      };
    }, []);

    /******************************************************************
     * RENDER
     ******************************************************************/
    return (
      <section className="roulette">
        {/* Indicador (flecha) arriba de la ruleta */}
        <div
          className={`roulette__indicator ${
            indicatorActive ? "roulette__indicator--active" : ""
          }`}
        ></div>

        {/* Círculo de la ruleta (lo medimos con wheelRef) */}
        <div className="roulette__wheel" id="rouletteWheel" ref={wheelRef}>
          {/* Botón central de "TIRAR" */}
          <button
            id="spinButton"
            className="roulette__wheel--btn"
            onClick={() => handleSpin({ force: false })}
            // isBusy ya incluye rouletteDisabled y blockUserSpin
            disabled={isBusy || isSpinning}
          >
            TIRAR
          </button>

          {/* Contenedor interno que SÍ gira */}
          <div
            className="roulette__wheelInner"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Solo pintamos gajos si ya calculamos tamaños */}
            {sliceSize.width > 0 &&
              wedges.map((wedge, index) => (
                <div
                  key={`${wedge.label}-${index}`}
                  className={`roulette__slice roulette__slice--${wedge.theme}`}
                  style={{
                    height: `${sliceSize.height}px`,
                    width: `${sliceSize.width}px`,

                    // Posicionamos cada gajo en su ángulo
                    transform: `translateX(-50%) rotate(${
                      index * degreesPerWedge
                    }deg)`,

                    // Variables CSS para el SCSS
                    "--wedge-color": wedge.color,
                    "--slice-width": `${sliceSize.width}px`,
                    "--slice-height": `${sliceSize.height}px`,
                  }}
                >
                  <span className="roulette__label">{wedge.label}</span>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }
);

export default Roulette;
