// Array con los gajos de la ruleta
// Cada objeto es un gajo: qué texto muestra, qué color/tema tiene y qué acción haría
export const wedges = [
  {
    label: "25",
    theme: "pink",
    color: "var(--color-wedge-pink)",
    action: "sumar",
    value: 25,
  },
  {
    label: "QUIEBRA",
    theme: "black",
    color: "var(--color-wedge-black)",
    action: "quiebra",
    value: 0,
  },
  {
    label: "100",
    theme: "orange",
    color: "var(--color-wedge-orange)",
    action: "sumar",
    value: 100,
  },
  {
    label: "PIERDE TURNO",
    theme: "silver",
    color: "var(--color-wedge-silver)",
    action: "pierdeTurno",
    value: 0,
  },
  {
    label: "75",
    theme: "purple",
    color: "var(--color-wedge-purple)",
    action: "sumar",
    value: 75,
  },
  {
    label: "????",
    theme: "gold",
    color: "var(--color-wedge-gold)",
    action: "riesgo",
    value: 0,
  },

  {
    label: "COMODIN",
    theme: "joker",
    color: "var(--color-wedge-joker)",
    action: "comodin",
    value: 0,
  },

  {
    label: "125",
    theme: "green",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 125,
  },
  {
    label: "25",
    theme: "pink",
    color: "var(--color-wedge-pink)",
    action: "sumar",
    value: 25,
  },
  {
    label: "QUIEBRA",
    theme: "black",
    color: "var(--color-wedge-black)",
    action: "quiebra",
    value: 0,
  },
  {
    label: "50",
    theme: "blue",
    color: "var(--color-wedge-blue)",
    action: "sumar",
    value: 50,
  },
  {
    label: "100",
    theme: "orange",
    color: "var(--color-wedge-orange)",
    action: "sumar",
    value: 100,
  },
  {
    label: "PIERDE TURNO",
    theme: "silver",
    color: "var(--color-wedge-silver)",
    action: "pierdeTurno",
    value: 0,
  },
  {
    label: "50",
    theme: "blue",
    color: "var(--color-wedge-blue)",
    action: "sumar",
    value: 50,
  },

  {
    label: "125",
    theme: "green",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 125,
  },
  {
    label: "SUPERPREMIO",
    theme: "gold",
    color: "var(--color-wedge-gold)",
    action: "superPremio",
    value: 500,
  },
];
