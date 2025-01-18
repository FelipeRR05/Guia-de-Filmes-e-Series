import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./header.module.css";
import LogoWhite from "../../images/logo-white.png";
import LogoBlack from "../../images/logo-black.png";
import SearchBar from "../search-bar/search-bar";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSearchBarOpen(false);
  }, [location]);

  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const handleSearchToggle = () => {
    setSearchBarOpen((prevState) => !prevState);
  };

  const handleNavigateClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <a onClick={() => handleNavigateClick("/")}>
            <img
              src={LogoWhite}
              alt="Logo branca"
              className={styles.logoWhite}
            />
            <img
              src={LogoBlack}
              alt="Logo preta"
              className={styles.logoBlack}
            />
          </a>
        </div>

        <nav className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
          <button
            className={styles.closeMenu}
            onClick={handleMenuToggle}
            aria-label="Fechar menu"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <a
            onClick={() => handleNavigateClick("/")}
            className={styles.navLink}
          >
            Catálogo
          </a>
          <a
            onClick={() => handleNavigateClick("/favorites")}
            className={styles.navLink}
          >
            Favoritos
          </a>
          <a
            onClick={() => handleNavigateClick("/quiz")}
            className={styles.navLink}
          >
            Quiz
          </a>
        </nav>

        {menuOpen && (
          <div
            className={styles.overlay}
            onClick={handleMenuToggle}
            aria-label="Fechar menu"
          ></div>
        )}

        <div className={styles.headerRight}>
          <button
            className={styles.menuToggle}
            onClick={handleMenuToggle}
            aria-label="Abrir menu"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>

          <button
            className={styles.searchToggle}
            onClick={handleSearchToggle}
            aria-label="Abrir barra de pesquisa"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </header>

      {searchBarOpen && <SearchBar />}
    </>
  );
}
