import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/userContext';
import '../index.css'

const Home = () => {
  const { user } = useContext(UserContext);
  const [resources, setResources] = useState([]);
  const [mentorships, setMentorships] = useState([]);

  useEffect(() => {
    const fetchLatestResources = async () => {
      try {
        const response = await fetch('resources', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        setResources(data.slice(0, 3)); 
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    const fetchMentorships = async () => {
      try {
        const response = await fetch('/mentorships', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch mentorships');
        const data = await response.json();
        setMentorships(data);
      } catch (error) {
        console.error('Error fetching mentorships:', error);
      }
    };

    fetchLatestResources();
    fetchMentorships();
  }, []);

  return (
    <div>
      <h1>Welcome to ConnectingBuddy</h1>
      <p>One Stop location for mentorship and resources.</p>
      <p>If you want to share a resource, please signup as a mentor. Only mentors are able to add an internship or scholarship.</p>

      <h2>Latest Resources</h2>
      <div className="cards">
        {resources.map((resource) => {
          // Find the related mentorship. If a mentorship is found, the mentor's name and event completion date are displayed in the card
          const mentorship = mentorships.find(m => m.resource_id === resource.id); 

          return (
            <div className="card" key={resource.id}>
              <div className="card-content">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <p>Type: {resource.resource_type}</p>
                <p>
                  Link:{" "}
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    {resource.link}
                  </a>
                </p>
                {mentorship && (
                  <div>
                    <p>Mentor: {mentorship.users.username}</p>
                    <p>Summary: {mentorship.summary}</p>
                    <p>Email: {mentorship.users.email}</p>
                    <p>Completed Event: {new Date(mentorship.completed_the_event).toLocaleDateString()}</p>
                    
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;