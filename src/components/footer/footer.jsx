import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./footer.module.css";
import LogoWhite from "../../images/logo-white.png";
import LogoBlack from "../../images/logo-black.png";

export default function Footer() {
  const navigate = useNavigate();

  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/feliperrocha/",
      label: "LinkedIn",
      icon: <FaLinkedin />,
    },
    {
      href: "https://github.com/FelipeRR05",
      label: "GitHub",
      icon: <FaGithub />,
    },
  ];

  const handleNavigateClick = () => {
    navigate("/");
  };

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <a onClick={handleNavigateClick}>
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

        <div className={styles.informations}>
          <div className={styles.contact}>
            <h4>Contato</h4>
            <p>E-mail: feliperrocha2005@gmail.com</p>
            <p>Redes Sociais:</p>
            <div className={styles.socialIcons}>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={styles.socialIcon}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.credits}>
            <h4>Créditos</h4>
            <p>Desenvolvedor: Felipe Roberto Rocha</p>
            <p>Tecnologias Usadas: React, TMDB API</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
