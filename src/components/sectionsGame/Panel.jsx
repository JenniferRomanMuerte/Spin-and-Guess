import "../../styles/layout/sectionGame/Panel.scss";

const Panel = () => {
  const clue = "Esta es la pista de la frase";
  const phrase = "La ruleta de la suerte";
  const words = phrase.split(" ");

  return (
    <article className="sectionPanel">
      <h2 className="sectionPanel__title">{clue}</h2>
      <section className="sectionPanel__panel" id="panel">
        {words.map((word, wordIndex) => (
          <div
            className="sectionPanel__panel--word"
            key={`${word}-${wordIndex}`}
          >
            {word.split("").map((char, charIndex) => (
              <div
                key={`${wordIndex}-${charIndex}`}
                className="sectionPanel__panel--letter sectionPanel__panel--letter--hidden"
              >
                {char.toUpperCase()}
              </div>
            ))}
            {wordIndex < words.length - 1 && (
              <div
                className="sectionPanel__panel--gap"
                aria-hidden="true"
              ></div>
            )}
          </div>
        ))}
      </section>
    </article>
  );
};

export default Panel;
