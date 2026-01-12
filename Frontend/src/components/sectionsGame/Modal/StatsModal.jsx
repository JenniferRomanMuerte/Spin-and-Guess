import "../../../styles/layout/sectionGame/StatsModal.scss";
import { useEffect, useState } from "react";
import { getRanking, getUserStats } from "../../../services/game.service";

const StatsModal = ({ type, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        if (type === "ranking") {
          const res = await getRanking();
          setData(res.ranking);
        }

        if (type === "history") {
          const res = await getUserStats();
          setData(res.stats);
        }
      } catch (err) {
        setError("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div className="statsModalOverlay">
      <div className="statsModal">
        <button className="statsModal__close" onClick={onClose}>
          ✖
        </button>

        <h2 className="statsModal__title">
          {type === "history" ? "📜 Mi historial" : "🏆 Ranking"}
        </h2>

        <div className="statsModal__content">
          {loading && <p>Cargando…</p>}
          {error && <p>{error}</p>}

          {!loading && !error && type === "ranking" && (
            <ul className="statsModal__content--statsList">
              {data.map((row, i) => (
                <li
                  key={row.username}
                  className="statsModal__content--statsList--statsItem"
                >
                  <span className="statsModal__content--statsList--statsItem__icon">
                    {i === 0 && "🥇"}
                    {i === 1 && "🥈"}
                    {i === 2 && "🥉"}
                    {i > 2 && "🏅"}
                  </span>

                  <span className="statsModal__content--statsList--statsItem__label">
                    {row.username}
                  </span>

                  <span className="statsModal__content--statsList--statsItem__value">
                    {row.best_score}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && type === "history" && data && (
            <ul className="statsModal__content--statsList">
              <li className="statsModal__content--statsList--statsItem">
                <span className="statsModal__content--statsList--statsItem__icon">
                  🎮
                </span>
                <span className="statsModal__content--statsList--statsItem__label">
                  Partidas jugadas:{" "}
                </span>
                <span className="statsModal__content--statsList--statsItem__value">
                  {data.games_played}
                </span>
              </li>

              <li className="statsModal__content--statsList--statsItem">
                <span className="statsModal__content--statsList--statsItem__icon">
                  🏆
                </span>
                <span className="statsModal__content--statsList--statsItem__label">
                  Victorias:{" "}
                </span>
                <span className="statsModal__content--statsList--statsItem__value">
                  {data.wins}
                </span>
              </li>

              <li className="statsModal__content--statsList--statsItem">
                <span className="statsModal__content--statsList--statsItem__icon">
                  💀
                </span>
                <span className="statsModal__content--statsList--statsItem__label">
                  Derrotas:{" "}
                </span>
                <span className="statsModal__content--statsList--statsItem__value">
                  {data.losses}
                </span>
              </li>

              <li className="statsModal__content--statsList--statsItem">
                <span className="statsModal__content--statsList--statsItem__icon">
                  ⭐
                </span>
                <span className="statsModal__content--statsList--statsItem__label">
                  Mejor puntuación:{" "}
                </span>
                <span className="statsModal__content--statsList--statsItem__value">
                  {data.best_score}
                </span>
              </li>

              <li className="statsModal__content--statsList--statsItem">
                <span className="statsModal__content--statsList--statsItem__icon">
                  📊
                </span>
                <span className="statsModal__content--statsList--statsItem__label">
                  Media de puntos:{" "}
                </span>
                <span className="statsModal__content--statsList--statsItem__value">
                  {data.avg_score}
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
