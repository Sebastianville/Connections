import React from 'react';

const FavoriteList = ({ favorites }) => {
  const handleRemoveFavorite = async (id) => {
    try {
      const response = await fetch(`favorites/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      // Optionally, refresh the list of favorites
      // Implement a method to update state in the parent component
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <ul>
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <li key={favorite.id}>
            {favorite.resource.title}
            <button onClick={() => handleRemoveFavorite(favorite.id)}>Remove</button>
          </li>
        ))
      ) : (
        <p>No favorites yet!</p>
      )}
    </ul>
  );
};

export default FavoriteList;