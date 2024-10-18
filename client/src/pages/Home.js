import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/userContext';
import '../index.css'

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
      <p>If you want to share a resource, please signup as a mentor. Only mentors are able to add an internship or scholarship.</p>
      
      <h2>Latest Resources</h2>
      <div className="cards">
        {resources.map((resource) => (
          <div className="card" key={resource.id}>
            <div className="card-content">
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <p>Type: {resource.resource_type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
