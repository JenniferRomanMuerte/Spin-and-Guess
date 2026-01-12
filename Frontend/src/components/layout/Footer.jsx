import "../../styles/layout/Footer.scss";
import logoutIcon from "../../images/logout.png";

const Footer = ({ namePlayer, onLogout, onShowHistory, onShowRanking }) => {
  return (
    <footer className="footer">
      <h2 className="footer__user">{namePlayer}</h2>

      <div className="footer__actions">
        <button className="footer__actions--link" onClick={onShowHistory}>
          📜 Historial
        </button>

        <button className="footer__actions--link" onClick={onShowRanking}>
          🏆 Ranking
        </button>

        <button
          onClick={onLogout}
          className="footer__actions--logout"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <img src={logoutIcon} alt="" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
