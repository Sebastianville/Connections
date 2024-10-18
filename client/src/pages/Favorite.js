import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/userContext';
import FavoriteList from '../components/FavoriteList';

const Favorites = () => {
  const { user, updateUser } = useContext(UserContext); 

  const [favorites, setFavorites] = useState([]);


  const removeFavorite = async (id) => {
    try {
      const response = await fetch(`/favorites/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      updateUser({...user, favorites: user.favorites.filter(fav => fav.id !== id)});
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div>
      <h1>Your Favorites</h1>
      <FavoriteList favorites={user.favorites} onRemove={removeFavorite} />
    </div>
  );
};

export default Favorites;