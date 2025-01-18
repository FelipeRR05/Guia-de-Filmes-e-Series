import styles from "./carousel.module.css";

export default function Carousel({
  title = "",
  items = [],
  emptyMessage = "Nenhum item encontrado",
  onFavoriteChange,
  component: Component,
}) {
  if (!Component) {
    console.error("Componente não fornecido para o Carousel");
    return <p>Erro: Componente inválido.</p>;
  }

  const determineMediaType = (item) => {
    if (item.media_type) return item.media_type;
    return title.toLowerCase().includes("série") ? "tv" : "movie";
  };

  return (
    <div className={styles.carouselContainer}>
      <h3>{title}</h3>
      <div className={styles.carousel}>
        {items.length === 0 ? (
          <p>{emptyMessage}</p>
        ) : (
          items.map((item) => (
            <Component
              key={item.id}
              movieId={item.id}
              mediaType={determineMediaType(item)}
              actor={item}
              onFavoriteChange={onFavoriteChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
