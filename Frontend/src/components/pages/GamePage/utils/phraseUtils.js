// Cuenta cuántas veces aparece una letra en una frase (ignorando mayúsculas/minúsculas)
export const countLetterInPhrase = (phrase, letter) => {
  const target = letter.toUpperCase();
  return phrase
    .toUpperCase()
    .split("")
    .filter((ch) => ch === target).length;
};

// Pluraliza textos simples
export const pluralize = (n, singular, plural) =>
  n === 1 ? singular : plural;

// Normaliza una frase para comparaciones (sin acentos, sin símbolos, sin dobles espacios)
export const normalizePhrase = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")                // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[^a-zñ0-9 ]/gi, "")    // elimina símbolos raros
    .replace(/\s+/g, " ")            // colapsa espacios
    .trim();
