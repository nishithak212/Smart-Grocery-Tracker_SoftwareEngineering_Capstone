import LogoText from "../../assets/Logo_Text.svg";
import "../Header/Header.scss";

const Header = () => {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={LogoText}
        alt="Grocery-Genie-Logo"
      ></img>
    </header>
  );
};

export default Header;
