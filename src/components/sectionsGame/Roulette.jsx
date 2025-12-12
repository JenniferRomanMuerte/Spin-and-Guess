import { useEffect, useRef, useState } from "react";
import "../../styles/layout/sectionGame/RouletteGame.scss";

// Array con los gajos de la ruleta
// Cada objeto es un gajo: qué texto muestra, qué color/tema tiene y qué acción haría
const wedges = [
  {
    label: "200",
    theme: "pink",
    color: "var(--color-wedge-pink)",
    action: "sumar",
    value: 200,
  },
  {
    label: "QUIEBRA",
    theme: "black",
    color: "var(--color-wedge-black)",
    action: "quiebra",
    value: 0,
  },
  {
    label: "300",
    theme: "orange",
    color: "var(--color-wedge-orange)",
    action: "sumar",
    value: 300,
  },
  {
    label: "PIERDE TURNO",
    theme: "silver",
    color: "var(--color-wedge-silver)",
    action: "pierdeTurno",
    value: 0,
  },
  {
    label: "1000",
    theme: "purple",
    color: "var(--color-wedge-purple)",
    action: "sumar",
    value: 1000,
  },
  {
    label: "400",
    theme: "blue",
    color: "var(--color-wedge-blue)",
    action: "sumar",
    value: 400,
  },
  {
    label: "COMODIN",
    theme: "gold",
    color: "var(--color-wedge-gold)",
    action: "comodin",
    value: 0,
  },
  {
    label: "500",
    theme: "green",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 500,
  },
  {
    label: "600",
    theme: "pink",
    color: "var(--color-wedge-pink)",
    action: "sumar",
    value: 600,
  },
  {
    label: "QUIEBRA",
    theme: "black",
    color: "var(--color-wedge-black)",
    action: "quiebra",
    value: 0,
  },
  {
    label: "700",
    theme: "blue",
    color: "var(--color-wedge-blue)",
    action: "sumar",
    value: 700,
  },
  {
    label: "800",
    theme: "orange",
    color: "var(--color-wedge-orange)",
    action: "sumar",
    value: 800,
  },
  {
    label: "PIERDE TURNO",
    theme: "silver",
    color: "var(--color-wedge-silver)",
    action: "pierdeTurno",
    value: 0,
  },
  {
    label: "900",
    theme: "green",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 900,
  },
  {
    label: "1000",
    theme: "purple",
    color: "var(--color-wedge-purple)",
    action: "sumar",
    value: 1000,
  },
  {
    label: "SUPERPREMIO",
    theme: "gold",
    color: "var(--color-wedge-gold)",
    action: "superPremio",
    value: 2000,
  },
];

const Roulette = () => {
  /*
  useRef: referencia al elemento de la ruleta
  con const wheelRef = useRef(null); creamos un objeto con la propiedad current en null porque
  al principio aún no está pintado el elemento que queremos guardar aqui.
  Después de renderizar la sección de la ruleta le asignamos el section a ref={wheelRef},
  wheelRef.current apuntará a ese elemento
  */
  const wheelRef = useRef(null);

  // Estado para guardar las dimensiones de cada gajo
  const [sliceSize, setSliceSize] = useState({ width: 0, height: 0 });

  /*
  Ángulo que le corresponde a cada gajo (en grados)
  360º dividido entre el número de gajos
  */
  const degreesPerWedge = 360 / wedges.length;

  // ESTADOS PARA CONTROLAR EL GIRO DE LA RULETA Y LA POSICION DEL GAJO

  // Angulo acumulado de la ruleta
  const [rotation, setRotation] = useState(0);

  // Para saber la rotación real
  const rotationRef = useRef(0);

  // Para saber que gajo ha salido
  const [winnerIndex, setWinnerIndex] = useState(null);

  // Saber si la riuleta está girando
  const [isSpinning, setIsSpinning] = useState(false);

  // Saber si el indicador está activo
  const [indicatorActive, setIndicatorActive] = useState(false);

  //useEffect: calcula el tamaño de los gajos según el tamaño real de la ruleta
  useEffect(() => {
    // Función que calcula tamaños y los guarda en el estado
    const updateSizes = () => {
      // Si aún no hay referencia al DOM, salimos (por seguridad)
      if (!wheelRef.current) return;

      //radius = mitad del ancho del círculo
      const radius = wheelRef.current.offsetWidth / 2;

      //convertimos el ángulo de cada gajo a radianes para usar trigonometría
      const angleRad = (degreesPerWedge * Math.PI) / 180;

      //alto del triángulo (gajo):
      // usamos casi todo el radio (0.95 para dejar un aro bonito alrededor)
      const sliceHeight = radius * 0.95;

      /*
      ancho del triángulo:
      fórmula: 2 * altura * tan(ángulo/2)
      */
      const sliceWidth = 2 * sliceHeight * Math.tan(angleRad / 2);

      // Guardamos los tamaños en el estado
      setSliceSize({ width: sliceWidth, height: sliceHeight });
    };

    //Llamamos una primera vez para calcular tamaños cuando el componente se monta
    updateSizes();

    //Si cambia el tamaño de la ventana, recalculamos tamaños
    window.addEventListener("resize", updateSizes);

    /*
    Cleanup del efecto:
    cuando el componente se desmonte, quitamos el listener de resize
    */
    return () => window.removeEventListener("resize", updateSizes);
  }, [degreesPerWedge]);

  /*
  Dependencias del efecto:
  Solo depende de degreesPerWedge, que viene de wedges.length.
  Como wedges no cambia, en la práctica se ejecuta una vez al montar
  y luego solo cuando cambie el tamaño de la ventana (por el listener).
*/

// De momento para mostrar por consola el gajo
  useEffect(() => {
    if (winnerIndex === null) return;
    const winner = wedges[winnerIndex];
    console.log("Ha salido:", winner.label, winner.action, winner.value);
  }, [winnerIndex]);

  // Función para girar la ruleta
  const handleSpin = () => {
    // Si ya está girando, ignoramos el click
    if (isSpinning) return;

    setIsSpinning(true);
    setIndicatorActive(false);

    // Vueltas aleatorias entre 3 y 6
    const minTurns = 1;
    const maxTurns = 3;
    const randomTurns =
      Math.floor(Math.random() * (maxTurns - minTurns + 1)) + minTurns;

    // offset aleatorio
    const randomOffset = Math.random() * 360;

    // Le añadimos aleatoriedad al giro
    const extraDegrees = randomTurns * 360 + randomOffset;

    // actualizamos el ángulo acumulado en el ref
    rotationRef.current += extraDegrees;

    // actualizamos la rotación acumulada
    setRotation(rotationRef.current);

    // ⏱️ cuando termine la animación, marcamos que ya no está girando
    setTimeout(() => {
      setIsSpinning(false);
      setIndicatorActive(true);

      // calculamos qué gajo ha salido
      const index = getWinnerIndexFromRotation(rotationRef.current);
      setWinnerIndex(index);

      setTimeout(() => {
        setIndicatorActive(false);
      }, 2000);
    }, 4500); // debe coincidir con la duración de la transición de CSS
  };

  // Dado un ángulo total, calcula qué gajo ha quedado bajo el indicador
  const getWinnerIndexFromRotation = (totalRotation) => {
  // 1. Normalizamos a 0–360
  const normalized = ((totalRotation % 360) + 360) % 360;

  /*
    2. Pensamos así:

    - La rueda gira clockwise (rotate positivo).
    - El indicador está fijo arriba.
    - Si la rueda gira R grados, es como si el indicador mirara
      R grados hacia atrás.

    Por eso usamos (360 - normalized).

    Además sumamos degreesPerWedge / 2 para “centrar” en el
    medio del gajo, no en la línea que separa dos gajos.
  */

  const angleFromTop =
    (360 - normalized + degreesPerWedge / 2) % 360;

  // 3. Ese ángulo lo convertimos en índice de gajo
  const index = Math.floor(angleFromTop / degreesPerWedge);

  // 4. Lo dejamos entre 0 y wedges.length - 1 por seguridad
  return (index + wedges.length) % wedges.length;
};


  return (
    <article className="roulette">
      {/* Indicador (flecha) arriba de la ruleta */}
      <section
        className={`roulette__indicator ${
          indicatorActive ? "roulette__indicator--active" : ""
        }`}
      ></section>

      {/* Círculo de la ruleta. ref={wheelRef} conecta este elemento con wheelRef.current */}
      <section className="roulette__wheel" id="rouletteWheel" ref={wheelRef}>
        {/* Botón central de "TIRAR" */}
        <button
          id="spinButton"
          className="roulette__wheel--btn"
          onClick={handleSpin}
          disabled={isSpinning}
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
      </section>
    </article>
  );
};

export default Roulette;
