"use strict";

// Construcción de la ruleta

// Array con los valores de la ruleta
const wedges = [
  // Normales + especiales alternados
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

const wheel = document.getElementById("rouletteWheel");
const totalWedges = wedges.length;
const degreesPerWedge = 360 / totalWedges; // Calculamos los grados que debe tener cada gajo

const createRoulette = () => {
  // radio de la ruleta (mitad del ancho)
  const radius = wheel.offsetWidth / 2;

  // pasamos ángulo a radianes
  const angleRad = (degreesPerWedge * Math.PI) / 180;

  // altura del triángulo = radio
  const sliceHeight = radius * 0.95;

  // ancho del triángulo según el ángulo
  const sliceWidth = 2 * sliceHeight * Math.tan(angleRad / 2);

  wedges.forEach((wedge, index) => {
    const slice = document.createElement("div");
    slice.classList.add("roulette__slice");

    // clase según el tema de color
    slice.classList.add(`roulette__slice--${wedge.theme}`);

    // Tamaños
    slice.style.height = `${sliceHeight}px`;
    slice.style.width = `${sliceWidth}px`;

    // Color SOLO en la custom prop
    slice.style.setProperty("--wedge-color", wedge.color);
    slice.style.setProperty("--slice-width", `${sliceWidth}px`);
    slice.style.setProperty("--slice-height", `${sliceHeight}px`);

    slice.style.transform = `translateX(-50%) rotate(${
      index * degreesPerWedge
    }deg)`;

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
