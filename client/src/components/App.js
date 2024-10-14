import React, { useEffect, useState } from "react";
import College from '../pages/College'
import { Switch, Route } from "react-router-dom";
import AdminDashBoard from "../pages/AdminDashBoard.Js";

function App() {

  const [resources, setResources] = useState([])
  const [user, setUser] = useState(null);


  const fetchResources = async () => {
    const response = await fetch('http://localhost:5555/resources');
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    return response.json();
  };

  if (!user) return <Login onLogin={setUser} />;
  
  return (
    <>
      <AdminDashBoard /> 
    </>
  );
}

export default App;
