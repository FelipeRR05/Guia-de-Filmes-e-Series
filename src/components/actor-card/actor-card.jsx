import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import styles from "./actor-card.module.css";

export default function ActorCard({ actor }) {
  const navigate = useNavigate();
  const { profile_path, name, character } = actor;

  return (
    <div
      className={`${styles.card} ${styles.grow}`}
      onClick={() => navigate(`/person/${actor.id}`)}
    >
      <div className={styles.imageContainer}>
        {!profile_path ? (
          <div className={styles.placeholder}>
            <FaImage />
          </div>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/w200${profile_path}`}
            alt={name}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.character}>{character}</p>
      </div>
    </div>
  );
}
