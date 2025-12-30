// Calcula width/height del gajo en base al radius y el ángulo
export const calcSliceSize = (wheelWidth, degreesPerWedge) => {
  const radius = wheelWidth / 2;
  const angleRad = (degreesPerWedge * Math.PI) / 180;

  const height = radius * 0.95;
  const width = 2 * height * Math.tan(angleRad / 2);

  return { width, height };
};

// Dado un ángulo total, devuelve el índice del gajo ganador
export const getWinnerIndexFromRotation = (
  totalRotation,
  degreesPerWedge,
  wedgesLength
) => {
  const normalized = ((totalRotation % 360) + 360) % 360;
  const angleFromTop = (360 - normalized + degreesPerWedge / 2) % 360;
  const index = Math.floor(angleFromTop / degreesPerWedge);
  return (index + wedgesLength) % wedgesLength;
};

// Genera el extraDegrees aleatorio (vueltas + offset)
export const getRandomSpinDegrees = (minTurns = 1, maxTurns = 3) => {
  const randomTurns =
    Math.floor(Math.random() * (maxTurns - minTurns + 1)) + minTurns;
  const randomOffset = Math.random() * 360;
  return randomTurns * 360 + randomOffset;
};
