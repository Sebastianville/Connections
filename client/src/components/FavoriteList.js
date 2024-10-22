import React from 'react';
import '../index.css';

const FavoriteList = ({ favorites, onRemove }) => {

  
  return (
    <div className="cards"> 
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <div className="card" key={favorite.id}>
            <div className="card-content">
              <h3>{favorite.resource.title}</h3>
              <p>{favorite.resource.description}</p>
              <p>Type of Resource: {favorite.resource.resource_type}</p>
              <p>
                Link:{" "}
                <a href={favorite.resource.link} target="_blank" rel="noopener noreferrer">
                  {favorite.resource.link}
                </a>
              </p>

              {favorite.resource.mentorships && favorite.resource.mentorships.length > 0 && (
                <div>
                  {favorite.resource.mentorships.map((mentorship) => (
                    <div key={mentorship.id}>
                      <p>Mentor: {mentorship.users.username}</p>
                      <p>Summary: {mentorship.summary}</p>
                      <p>Email: {mentorship.users.email}</p>
                      <p>
                        Completed Event:{" "}
                        {new Date(mentorship.completed_the_event).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => onRemove(favorite.id)}>Remove</button>
            </div>
          </div>
        ))
      ) : (
        <p>No favorites yet!</p>
      )}
    </div>
  );
};

export default FavoriteList;