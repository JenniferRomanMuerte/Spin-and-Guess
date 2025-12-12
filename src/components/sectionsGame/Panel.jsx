import "../../styles/layout/sectionGame/Panel.scss";


const Panel = () => {
  // Texto de la pista que se muestra arriba
  const clue = "Esta es la pista de la frase";

  // Frase que se va a mostrar en el panel (de momento está fija)
  const phrase = "La ruleta de la suerte";

  // Separamos la frase en palabras usando el espacio
  const words = phrase.split(" ");

  return (
    <article className="sectionPanel">
      <h2 className="sectionPanel__title">{clue}</h2>
      
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
            {/* Para cada palabra, recorremos sus letras */}
            {word.split("").map((char, charIndex) => (
              <div
                key={`${wordIndex}-${charIndex}`} // key única por letra
                className="
                  sectionPanel__panel--letter
                  sectionPanel__panel--letter--hidden
                "
              >
                {/* La letra en mayúsculas dentro de su “casilla” */}
                {char.toUpperCase()}
              </div>
            ))}

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
