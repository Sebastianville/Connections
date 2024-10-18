import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/userContext';
import '../index.css';

const College = () => {
  const { user, updateUser } = useContext(UserContext);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState(''); // Notification state

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/resources', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        setResources(data);
        setFilteredResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter((resource) => resource.resource_type.toLowerCase() === filter.toLowerCase()));
    }
  }, [filter, resources]);

  const addToFavorites = async (resourceId) => {
    if (!user) {
      setNotification('You must be logged in to add favorites.');
      clearNotification();
      return;
    }

    // Check if the resource is already in the user's favorites
    if (user.favorites.some(favorite => favorite.id === resourceId)) {
      setNotification('This resource is already in your favorites.');
      
      clearNotification();
      return;
    }

    try {
      const response = await fetch('/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resource_id: resourceId }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add favorite');
      }

      const data = await response.json();
      console.log('Favorite added:', data);
      updateUser({...user, favorites: [...user.favorites, data]});
      setNotification('Resource added to favorites.'); // Set success notification
      clearNotification(); // Clear notification after a delay
    } catch (error) {
      console.error('Error adding favorite:', error);
      setNotification('Failed to add resource to favorites.');
      clearNotification();
    }
  };

  const clearNotification = () => {
    setTimeout(() => {
      setNotification('');
    }, 3000); 
  };

  return (
    <div>
      <h1>College Resources</h1>

      <div>
        <label>
          Filter by:
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="all">All</option>
            <option value="scholarship">Scholarship</option>
            <option value="internship">Internship</option>
          </select>
        </label>
      </div>

      {/* Display notification if present */}
      {notification && <p className="notification">{notification}</p>}

      <div className="cards">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div className="card" key={resource.id}>
              <div className="card-content">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <p>Type of Resource: {resource.resource_type}</p>
                {user ? (
                  <button onClick={() => addToFavorites(resource.id)}>
                    Add to Favorites
                  </button>
                ) : (
                  <button disabled>Add to Favorites (Login Required)</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default College;