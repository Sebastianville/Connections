import React from 'react';
import '../index.css'

const FavoriteList = ({ favorites, onRemove }) => {


  return (
    <div className="cards">
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <div className="card" key={favorite.id}>
            <div className="card-content">
              <h3>{favorite.resource.title}</h3>
              <p>{favorite.resource.description}</p>
              <button onClick={() => onRemove(favorite.id)}>Remove</button>
            </div>
          </div>
        ))
      ) : (
        <p>No favorites yet!</p>
      )}
    </div>
  );
};

export default FavoriteList;