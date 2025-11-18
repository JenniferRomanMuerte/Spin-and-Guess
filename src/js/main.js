'use strict';

const wedges = [
  { label: "500", color: "var(--color-wedge-yellow)", action: "sumar", value: 500 },
  { label: "700", color: "var(--color-wedge-blue)", action: "sumar", value: 700 },
  { label: "1000", color: "var(--color-wedge-green)", action: "sumar", value: 1000 },
  { label: "PIERDE TURNO", color: "var(--color-wedge-silver)", action: "pierdeTurno", value: 0 },
  { label: "300", color: "var(--color-wedge-orange)", action: "sumar", value: 300 },
  { label: "800", color: "var(--color-wedge-purple)", action: "sumar", value: 800 },
  { label: "400", color: "var(--color-wedge-pink)", action: "sumar", value: 400 },
  { label: "BAZUCA", color: "var(--color-wedge-red)", action: "especial", value: -1 },
  { label: "600", color: "var(--color-wedge-green)", action: "sumar", value: 600 },
  { label: "QUIEBRA", color: "var(--color-wedge-black)", action: "quiebra", value: 0 },
  { label: "200", color: "var(--color-wedge-yellow)", action: "sumar", value: 200 },
  { label: "900", color: "var(--color-wedge-blue)", action: "sumar", value: 900 },
  { label: "700", color: "var(--color-wedge-pink)", action: "sumar", value: 700 },
  { label: "1000", color: "var(--color-wedge-green)", action: "sumar", value: 1000 },
  { label: "500", color: "var(--color-wedge-orange)", action: "sumar", value: 500 },
  { label: "MISTERIO", color: "var(--color-wedge-gold)", action: "misterio", value: 0 },
  { label: "300", color: "var(--color-wedge-purple)", action: "sumar", value: 300 },
  { label: "800", color: "var(--color-wedge-pink)", action: "sumar", value: 800 },
  { label: "400", color: "var(--color-wedge-blue)", action: "sumar", value: 400 },
  { label: "1000", color: "var(--color-wedge-green)", action: "sumar", value: 1000 },
  { label: "PIERDE TURNO", color: "var(--color-wedge-silver)", action: "pierdeTurno", value: 0 },
  { label: "200", color: "var(--color-wedge-yellow)", action: "sumar", value: 200 },
  { label: "QUIEBRA", color: "var(--color-wedge-black)", action: "quiebra", value: 0 },
  { label: "SUPERPREMIO", color: "var(--color-wedge-gold)", action: "superPremio", value: 2000 }
];



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
