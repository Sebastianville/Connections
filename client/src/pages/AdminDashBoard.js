import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';


const AdminDashboard = () => {
  const history = useHistory()
  const [resource, setResource] = useState({
    title: '',
    description: '',
    link: '',  
    resource_type: 'internship',  
  });

  const handleChange = (e) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to submit resource');
      const newResource = await response.json();
      console.log('Resource submitted:', newResource);
      
      
      setResource({ title: '', description: '', link: '', resource_type: 'internship' });
      
      alert('Resource submitted successfully!');
      history.push("/college")

    } catch (error) {
      console.error('Error submitting resource:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={resource.title} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={resource.description} onChange={handleChange} required />
        </label>
        <label>
          Link:  
          <input type="url" name="link" value={resource.link} onChange={handleChange} required />
        </label>
        <label>
          Type:
          <select name="resource_type" value={resource.resource_type} onChange={handleChange}>  {/* Change name to resource_type */}
            <option value="internship">Internship</option>
            <option value="scholarship">Scholarship</option>
          </select>
        </label>
        <button type="submit">Submit Resource</button>
      </form>
    </div>
  );
};

export default AdminDashboard;