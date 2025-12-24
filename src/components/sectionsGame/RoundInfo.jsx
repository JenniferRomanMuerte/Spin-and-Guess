import "../../styles/layout/sectionGame/RoundInfo.scss";

const RoundInfo = ({ messageRoundInfo }) => {
  return (
    <article>
      <p className="roundInfo">{messageRoundInfo}</p>
    </article>
  );
};

export default RoundInfo;
