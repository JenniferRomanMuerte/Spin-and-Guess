export const countLetterInPhrase = (phrase, letter) => {
  const target = letter.toUpperCase();
  return phrase
    .toUpperCase()
    .split("")
    .filter((ch) => ch === target).length;
};
