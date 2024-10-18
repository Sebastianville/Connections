import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/userContext';

const College = () => {
  const { user, updateUser } = useContext(UserContext);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
   // Need a filter and a default filter to show all
  const [filter, setFilter] = useState('all');

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
      alert('You must be logged in to add favorites.');
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
      updateUser({...user, favorites: [...user.favorites, data]})
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  //     if (!response.ok) throw new Error('Failed to add to favorites');
  //     const newFavorite = await response.json();
  //     alert('Resource added to favorites!');
  //     updateFavorites(newFavorite);
  //   } catch (error) {
  //     console.error('Error adding to favorites:', error);
  //     alert('Error adding to favorites');
  //   }
  // };

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
      <ul>
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <li key={resource.id}>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <p>Type of Resource: {resource.resource_type}</p>
              {user ? (
                <button onClick={() => addToFavorites(resource.id)}>Add to Favorites</button>
              ) : (
                <button disabled>Add to Favorites (Login Required)</button>
              )}
            </li>
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </ul>
    </div>
  );
};

export default College;