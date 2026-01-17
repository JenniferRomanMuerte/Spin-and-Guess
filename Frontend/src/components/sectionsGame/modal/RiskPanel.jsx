const RiskPanel = ({ resolveRisk}) => {
  return (
    <div className="riskPanel">
      <h3 className="riskPanel__title">🎲 Gajo misterioso</h3>

      <p className="riskPanel__info">
        Este gajo puede <span className="riskPanel__info--strong">duplicar</span> o <span  className="riskPanel__info--strong">dividir</span> tus
        puntos al azar.
      </p>

      <p className="riskPanel__question">¿Quieres levantar?</p>

      <div className="riskPanel__actions">
        <button className="riskPanel__actions--btn" onClick={() => resolveRisk(true)}>
          Sí, arriesgar
        </button>

        <button className="riskPanel__actions--btn" onClick={() => resolveRisk(false)}>
          No, pasar
        </button>
      </div>
    </div>
  );
};

export default RiskPanel;
