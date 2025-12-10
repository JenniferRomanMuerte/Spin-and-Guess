import "../styles/layout/GameMain.scss";
import ControlsGame from "./sectionsGame/ControlsGame";
import Markers from "./sectionsGame/Markers";
import Panel from "./sectionsGame/Panel";
import Roulette from "./sectionsGame/Roulette";

const GamePage = () => {
  return (
    <main className="gameMain">
      <Panel />
      <Markers />
      <Roulette />
      <ControlsGame />
    </main>
  );
};

export default GamePage;
