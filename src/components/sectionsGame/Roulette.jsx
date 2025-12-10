import { useEffect, useRef, useState } from "react";
import "../../styles/layout/sectionGame/RouletteGame.scss";

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
    label: "MISTERIO",
    theme: "gold",
    color: "var(--color-wedge-gold)",
    action: "misterio",
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
  const wheelRef = useRef(null);
  const [sliceSize, setSliceSize] = useState({ width: 0, height: 0 });
  const degreesPerWedge = 360 / wedges.length;

  useEffect(() => {
    const updateSizes = () => {
      if (!wheelRef.current) return;

      const radius = wheelRef.current.offsetWidth / 2;
      const angleRad = (degreesPerWedge * Math.PI) / 180;
      const sliceHeight = radius * 0.95;
      const sliceWidth = 2 * sliceHeight * Math.tan(angleRad / 2);

      setSliceSize({ width: sliceWidth, height: sliceHeight });
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, [degreesPerWedge]);

  return (
    <article className="roulette">
      <section className="roulette__indicator"></section>
      <section className="roulette__wheel" id="rouletteWheel" ref={wheelRef}>
        <button id="spinButton" className="roulette__wheel--btn">
          TIRAR
        </button>
        {sliceSize.width > 0 &&
          wedges.map((wedge, index) => (
            <div
              key={`${wedge.label}-${index}`}
              className={`roulette__slice roulette__slice--${wedge.theme}`}
              style={{
                height: `${sliceSize.height}px`,
                width: `${sliceSize.width}px`,
                transform: `translateX(-50%) rotate(${index * degreesPerWedge}deg)`,
                "--wedge-color": wedge.color,
                "--slice-width": `${sliceSize.width}px`,
                "--slice-height": `${sliceSize.height}px`,
              }}
            >
              <span className="roulette__label">{wedge.label}</span>
            </div>
          ))}
      </section>
    </article>
  );
};

export default Roulette;
