import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/userContext';
import FavoriteList from '../components/FavoriteList';

const Favorites = () => {
  const { user, updateUser } = useContext(UserContext); 
  // We want to create a local copy of favorites, that each user can manage that is not from the userContext. This in turn will not directly affect the global state until they are ready to be synchronized. 
  // const [localFavorites, setLocalFavorites] = useState(favorites);
  const [favorites, setFavorites] = useState([]);




  // useEffect(() => {
  //   // Sync localFavorites with the global favorites when it changes
  //   setLocalFavorites(favorites);
  // }, [favorites]);

  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     if (user) {
  //       try {
  //         // credentials: 'include' ensures that any cookes are set along with the request to the server
  //         const response = await fetch('/favorites', { credentials: 'include' });
  //         if (!response.ok) throw new Error('Failed to fetch favorites');
  //         const data = await response.json();
  //         setFavorites(data);
  //       } catch (error) {
  //         console.error('Error fetching favorites:', error);
  //       }
  //     }
  //   };

  //   fetchFavorites();
  //   // Fetch favorites when user is available
  // }, [user]); 


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