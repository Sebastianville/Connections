import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/userContext';

const Home = () => {
  const { user } = useContext(UserContext);
  console.log('User context:', user); 
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchLatestResources = async () => {
      try {
        const response = await fetch('resources', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        console.log('Fetched resources:', data); 
        setResources(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchLatestResources();
  }, []);

  return (
    <div>
      <h1>Welcome to ConnectingBuddy</h1>
      <p>One Stop location for mentorship and resources.</p>
      <h2>Latest Resources</h2>
      <ul>
        {resources.map((resource) => (
          <li key={resource.id}>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <p>Type: {resource.resource_type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
