// Cuenta cuántas veces aparece una letra en una frase (ignorando mayúsculas/minúsculas)
export const countLetterInPhrase = (phrase, letter) => {
  const target = letter.toUpperCase();
  return phrase
    .toUpperCase()
    .split("")
    .filter((ch) => ch === target).length;
};

export const pluralize = (n, singular, plural) => (n === 1 ? singular : plural);
