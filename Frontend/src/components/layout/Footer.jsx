import "../../styles/layout/Footer.scss";
import logoutIcon from "../../images/logout.png";

const Footer = ({ isGame, namePlayer, onLogout }) => {
  return (
    <footer className="footer">
      <h2>
        {isGame && namePlayer ? ` ${namePlayer}` : 'Jennifer Roman 2025'}
      </h2>
      {isGame && (
        <button
          onClick={onLogout}
          className="footer__logout"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <img src={logoutIcon} alt="" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
