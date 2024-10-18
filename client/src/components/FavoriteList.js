const FavoriteList = ({ favorites, onRemove }) => {
 
 
  return (
    <ul>
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <li key={favorite.id}>
            <h3>{favorite.resource.title}</h3>
            <p>{favorite.resource.description}</p>
            <button onClick={() => onRemove(favorite.id)}>Remove</button>
          </li>
        ))
      ) : (
        <p>No favorites yet!</p>
      )}
    </ul>
  );
};

export default FavoriteList;