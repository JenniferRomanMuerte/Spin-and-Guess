import "../../styles/layout/sectionGame/Panel.scss";

const Panel = ({ phrase, clue , category, selectedLetters }) => {
  // Separamos la frase en palabras usando el espacio
  const words = phrase.split(" ");

  return (
    <article className="sectionPanel">
    <h2 className="sectionPanel__category">{category}</h2>
      <h3 className="sectionPanel__clue">{clue}</h3>
      {/* Contenedor principal del panel de letras */}
      <section className="sectionPanel__panel" id="panel">
        {/* Recorremos cada palabra de la frase */}
        {words.map((word, wordIndex) => (
          <div
            // Contenedor para una palabra completa
            className="sectionPanel__panel--word"
            // key única con la palabra + índice (por si hay repetidas)
            key={`${word}-${wordIndex}`}
          >
            {/* Para cada palabra, recorremos sus letras y comprobamos si está la que ha elegido el usuario para ponerle una clase u otra*/}
            {word.split("").map((char, charIndex) => {
              const isVisible = selectedLetters.includes(char.toUpperCase());

              return (
                <div
                  key={`${wordIndex}-${charIndex}`}
                  className={`sectionPanel__panel--letter ${
                    isVisible
                      ? "sectionPanel__panel--letter"
                      : "sectionPanel__panel--letter--hidden"
                  }`}
                >
                  {char.toUpperCase()}
                </div>
              );
            })}

            {/*
              Si NO es la última palabra, pintamos un "hueco" entre palabras.
            */}
            {wordIndex < words.length - 1 && (
              <div
                className="sectionPanel__panel--gap"
                aria-hidden="true" // no aporta info extra al lector de pantalla
              ></div>
            )}
          </div>
        ))}
      </section>
    </article>
  );
};

export default Panel;
