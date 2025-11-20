"use strict";

// Construcción de la ruleta

// Array con los valores de la ruleta
const wedges = [
  {
    label: "500",
    color: "var(--color-wedge-yellow)",
    action: "sumar",
    value: 500,
  },
  {
    label: "700",
    color: "var(--color-wedge-blue)",
    action: "sumar",
    value: 700,
  },
  {
    label: "1000",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 1000,
  },
  {
    label: "PIERDE TURNO",
    color: "var(--color-wedge-silver)",
    action: "pierdeTurno",
    value: 0,
  },
  {
    label: "300",
    color: "var(--color-wedge-orange)",
    action: "sumar",
    value: 300,
  },
  {
    label: "800",
    color: "var(--color-wedge-purple)",
    action: "sumar",
    value: 800,
  },
  {
    label: "400",
    color: "var(--color-wedge-pink)",
    action: "sumar",
    value: 400,
  },
  {
    label: "BAZUCA",
    color: "var(--color-wedge-red)",
    action: "especial",
    value: -1,
  },
  {
    label: "600",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 600,
  },
  {
    label: "QUIEBRA",
    color: "var(--color-wedge-black)",
    action: "quiebra",
    value: 0,
  },
  {
    label: "200",
    color: "var(--color-wedge-yellow)",
    action: "sumar",
    value: 200,
  },
  {
    label: "900",
    color: "var(--color-wedge-blue)",
    action: "sumar",
    value: 900,
  },
  {
    label: "700",
    color: "var(--color-wedge-pink)",
    action: "sumar",
    value: 700,
  },
  {
    label: "1000",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 1000,
  },
  {
    label: "500",
    color: "var(--color-wedge-orange)",
    action: "sumar",
    value: 500,
  },
  {
    label: "MISTERIO",
    color: "var(--color-wedge-gold)",
    action: "misterio",
    value: 0,
  },
  {
    label: "300",
    color: "var(--color-wedge-purple)",
    action: "sumar",
    value: 300,
  },
  {
    label: "800",
    color: "var(--color-wedge-pink)",
    action: "sumar",
    value: 800,
  },
  {
    label: "400",
    color: "var(--color-wedge-blue)",
    action: "sumar",
    value: 400,
  },
  {
    label: "1000",
    color: "var(--color-wedge-green)",
    action: "sumar",
    value: 1000,
  },
  {
    label: "PIERDE TURNO",
    color: "var(--color-wedge-silver)",
    action: "pierdeTurno",
    value: 0,
  },
  {
    label: "200",
    color: "var(--color-wedge-yellow)",
    action: "sumar",
    value: 200,
  },
  {
    label: "QUIEBRA",
    color: "var(--color-wedge-black)",
    action: "quiebra",
    value: 0,
  },
  {
    label: "SUPERPREMIO",
    color: "var(--color-wedge-gold)",
    action: "superPremio",
    value: 2000,
  },
];

const wheel = document.getElementById("rouletteWheel");
const totalWedges = wedges.length;
const degreesPerWedge = 360 / totalWedges; // Calculamos los grados que debe tener cada gajo

const createRoulette = () => {
  // radio de la ruleta (mitad del ancho)
  const radius = wheel.offsetWidth / 2;

  // pasamos ángulo a radianes
  const angleRad = (degreesPerWedge * Math.PI) / 180;

  // altura del triángulo = radio
  const sliceHeight = radius;

  // ancho del triángulo según el ángulo
  const sliceWidth = 2 * sliceHeight * Math.tan(angleRad / 2);


  wedges.forEach((wedge, index) => {
    const slice = document.createElement("div");
    slice.classList.add("roulette__slice");
    slice.style.backgroundColor = wedge.color;

    // aquí fijamos tamaño real del triángulo
    slice.style.height = `${sliceHeight}px`;
    slice.style.width = `${sliceWidth}px`;

    // rotamos cada gajo su ángulo exacto
    slice.style.transform = `translateX(-50%) rotate(${
      index * degreesPerWedge
    }deg)`;

     // 👇 AÑADIMOS EL TEXTO
    const label = document.createElement("span");
    label.classList.add("roulette__label");
    label.textContent = wedge.label;
    slice.appendChild(label);

    wheel.appendChild(slice);
  });
};

createRoulette();

// Frase simulada para hacer el diseño:
// 🧠 Frase temporal (simula lo que luego vendrá de la BBDD)
const phrase = "La ruleta de la suerte";

// 📦 Contenedor del panel
const panel = document.querySelector("#panel");

// 🚀 Convertir frase en letras (divs individuales)
phrase.split("").forEach((char) => {
  const letterDiv = document.createElement("div");
  letterDiv.classList.add("panel__letter");

  if (char === " ") {
    // Si es espacio, dejamos hueco visual
    letterDiv.classList.add("space");
  } else {
    // Por ahora las mostramos, luego se ocultarán
    letterDiv.textContent = char.toUpperCase();
  }

  panel.appendChild(letterDiv);
});
