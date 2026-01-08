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

    // Referencia al DOM real de la ruleta.
    // Se usa para medir su tamaño y calcular correctamente los gajos.
    const wheelRef = useRef(null);

    // Guardamos SIEMPRE la última versión de spinEnd en un ref.
    // Esto evita problemas de closures si la función cambia entre renders.
    const spinEndRef = useRef(spinEnd);

    // Rotación acumulada de la ruleta.
    // Usamos un ref para que NO se resetee en cada render.
    const rotationRef = useRef(0);

    // Referencia opcional para almacenar timeouts activos.
    // Permite limpiar animaciones si el componente se desmonta.
    const timeoutsRef = useRef([]);

    /******************************************************************
     * ESTADO DE UI (sí provoca re-render)
     ******************************************************************/

    // Tamaño calculado de cada gajo (triángulo)
    const [sliceSize, setSliceSize] = useState({ width: 0, height: 0 });

    // Rotación actual aplicada al DOM (solo para render)
    const [rotation, setRotation] = useState(0);

    // Índice del gajo ganador al finalizar el giro
    const [winnerIndex, setWinnerIndex] = useState(null);

    // Flag de estado: indica si la ruleta está girando ahora mismo
    const [isSpinning, setIsSpinning] = useState(false);

    // Control visual del indicador (flecha superior)
    const [indicatorActive, setIndicatorActive] = useState(false);

    /******************************************************************
     * DERIVADOS (no son estado, solo cálculos)
     ******************************************************************/

    // Grados que ocupa cada gajo según el total
    const degreesPerWedge = 360 / wedges.length;

    // La ruleta está "ocupada" si:
    // - está deshabilitada por la UI
    // - está bloqueada por reglas de turno
    const isBlockedByGame = rouletteDisabled || blockUserSpin;

    // Duración de la animación de giro (debe coincidir con el CSS)
    const SPIN_DURATION_MS = 4500;

    /******************************************************************
     * EFECTO: calcular tamaño de los gajos en función del tamaño real
     * del contenedor de la ruleta
     ******************************************************************/
    useEffect(() => {
      const updateSizes = () => {
        if (!wheelRef.current) return;

        // Calcula width y height del triángulo según el diámetro
        const { width, height } = calcSliceSize(
          wheelRef.current.offsetWidth,
          degreesPerWedge
        );

        setSliceSize({ width, height });
      };

      // Primera medición al montar
      updateSizes();

      // Recalcular si cambia el tamaño de la ventana
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
     * EFECTO: cuando se determina el gajo ganador,
     * notificamos al padre mediante spinEnd(winner)
     ******************************************************************/
    useEffect(() => {
      if (winnerIndex === null) return;

      const winner = wedges[winnerIndex];

      // Usamos la versión más reciente de spinEnd
      spinEndRef.current(winner);
    }, [winnerIndex]);

    /******************************************************************
     * UTILIDAD: determina si la ruleta puede girar
     ******************************************************************/
    const canSpin = ({ force }) => {
      if (isSpinning) return false;
      if (!force && isBlockedByGame) return false;
      return true;
    };

    /******************************************************************
     * FUNCIÓN PRINCIPAL: iniciar el giro de la ruleta
     * - force=true permite girar incluso si está deshabilitada (computer)
     ******************************************************************/
    const handleSpin = ({ force = false } = {}) => {
      if (!canSpin({ force })) return;

      // Avisamos al padre solo en giros del jugador
      if (!force) {
        startSpin?.();
      }

      // Reseteamos el ganador para forzar el efecto aunque se repita índice
      setWinnerIndex(null);

      // Marcamos estado de giro activo
      setIsSpinning(true);
      setIndicatorActive(false);

      // Calculamos grados extra (vueltas completas aleatorias)
      const extraDegrees = getRandomSpinDegrees(1, 3);

      // Sumamos al acumulado para evitar que la animación "vuelva atrás"
      rotationRef.current += extraDegrees;

      // Pintamos la rotación en el DOM
      setRotation(rotationRef.current);

      // Al finalizar la animación CSS, calculamos el ganador
      const t1 = setTimeout(() => {
        setIndicatorActive(true);

        // Determinamos el índice ganador según la rotación final
        const index = getWinnerIndexFromRotation(
          rotationRef.current,
          degreesPerWedge,
          wedges.length
        );

        setWinnerIndex(index);

        // Liberamos el estado de giro (siguiente tick)
        const t2 = setTimeout(() => setIsSpinning(false), 0);

        // Apagamos el indicador tras un breve tiempo (solo visual)
        const t3 = setTimeout(() => setIndicatorActive(false), 2000);

        timeoutsRef.current.push(t2, t3);
      }, SPIN_DURATION_MS);

      timeoutsRef.current.push(t1);
    };

    /******************************************************************
     * EXPONER MÉTODOS AL PADRE (GamePage) MEDIANTE REF
     ******************************************************************/
    useImperativeHandle(ref, () => ({
      // Permite al padre forzar el giro (turno de la computer)
      spin: () => handleSpin({ force: true }),
    }));

    /******************************************************************
     * LIMPIEZA: cancelar timeouts activos si el componente se desmonta
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
        {/* Indicador visual superior */}
        <div
          className={`roulette__indicator ${
            indicatorActive ? "roulette__indicator--active" : ""
          }`}
        ></div>

        {/* Contenedor de la ruleta (referencia para mediciones) */}
        <div className="roulette__wheel" ref={wheelRef}>
          {/* Botón central de acción */}
          <button
            className="roulette__wheel--btn"
            onClick={() => handleSpin({ force: false })}
            disabled={isBlockedByGame || isSpinning}
          >
            TIRAR
          </button>

          {/* Contenedor interno que rota */}
          <div
            className="roulette__wheelInner"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Pintamos los gajos solo cuando ya conocemos sus tamaños */}
            {sliceSize.width > 0 &&
              wedges.map((wedge, index) => (
                <div
                  key={`${wedge.label}-${index}`}
                  className={`roulette__slice roulette__slice--${wedge.theme}`}
                  style={{
                    height: `${sliceSize.height}px`,
                    width: `${sliceSize.width}px`,
                    transform: `translateX(-50%) rotate(${
                      index * degreesPerWedge
                    }deg)`,
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
