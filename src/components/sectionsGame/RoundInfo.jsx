import "../../styles/layout/sectionGame/RoundInfo.scss";

const RoundInfo = ({wedgeResult}) => {
  return (
    <article>
      {wedgeResult !== null &&<p className="roundInfo">
        Juegas por:  {wedgeResult.value}
      </p>}
    </article>
  );
};

export default RoundInfo;