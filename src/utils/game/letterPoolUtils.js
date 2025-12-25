export const getEnabledItems = (letters) =>
  letters.filter((item) => item.enabled);

// Devuelve el OBJETO completo: { letter, enabled, ... }
export const getRandomEnabledItem = (letters) => {
  const enabled = getEnabledItems(letters);
  if (enabled.length === 0) return null;
  return enabled[Math.floor(Math.random() * enabled.length)];
};

// Devuelve SOLO la letra: "A", "B", ...
export const getRandomEnabledLetter = (letters) => {
  const item = getRandomEnabledItem(letters);
  return item ? item.letter : null;
};
