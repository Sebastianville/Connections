import React, { useState } from 'react';

const AdminDashboard = () => {
  const [resource, setResource] = useState({
    title: '',
    description: '',
    type: 'internship', // default to internship
  });

  const handleChange = (e) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('resources', {
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
      setResource({ title: '', description: '', type: 'internship' });
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
          Type:
          <select name="type" value={resource.type} onChange={handleChange}>
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