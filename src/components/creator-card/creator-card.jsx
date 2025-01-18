import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import styles from "./creator-card.module.css";

export default function CreatorCard({ person }) {
  const navigate = useNavigate();
  const { profile_path, name, job } = person;

  return (
    <div
      className={`${styles.card} ${styles.grow}`}
      onClick={() => navigate(`/person/${person.id}`)}
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
        <p className={styles.job}>{job}</p>
      </div>
    </div>
  );
}
