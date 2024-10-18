import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  //need to add favorites into state
  const [favorites, setFavorites] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/check_session', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
  // add a useEffect hook that calls on fetchUser() when the Userprovider mounts. This ensures that the user session is chekced every time the app loads, therefore the user state across page refreshes
    fetchUser();
     // Empty dependency array which means it will run only conce when the componnet mounts. 
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateFavorites = (newFavorite) => {
    // Update the favorites state
    setFavorites((prevFavorites) => [...prevFavorites, newFavorite]); 
  };
  return (
    <UserContext.Provider value={{ user, setUser, updateUser, login, logout, favorites, updateFavorites  }}>
      {children}
    </UserContext.Provider>
  );
};
