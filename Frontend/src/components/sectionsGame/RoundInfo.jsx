import "../../styles/layout/sectionGame/RoundInfo.scss";

const RoundInfo = ({ messageRoundInfo }) => {
  return (
    <article className="roundInfo">
      <p  className="roundInfo__text">{messageRoundInfo}</p>
    </article>
  );
};

export default RoundInfo;
