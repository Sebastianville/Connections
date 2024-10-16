import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './userContext';
import FavoriteList from '../components/FavoriteList';

const Favorites = () => {
  const { user } = useContext(UserContext); // Use UserContext
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
            // credentials: 'include' ensures that any cookes are set along with the request to the server
          const response = await fetch('http://localhost:5555/favorites', { credentials: 'include' });
          if (!response.ok) throw new Error('Failed to fetch favorites');
          const data = await response.json();
          setFavorites(data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [user]); // Fetch favorites when user is available

  return (
    <div>
      <h1>Your Favorites</h1>
      <FavoriteList favorites={favorites} />
    </div>
  );
};

export default Favorites;