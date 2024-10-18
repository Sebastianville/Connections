import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider, UserContext } from './userContext';
import NavBar from './NavBar';

import Home from '../pages/Home';
import Favorite from '../pages/Favorite';
import AdminDashboard from '../pages/AdminDashBoard';
import Profile from '../pages/profile';
import College from '../pages/College';
import Login from './Login';


function App() {
  const { user } = useContext(UserContext); 

  return (
    <>
        <NavBar />
          { !user ? (
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" exact component={Home} />
              <Route path="/college" component={College} />
            </ Switch>
          ) : (
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/college" component={College} />
              <Route path="/favorite" component={Favorite} />
              <Route path="/profile" component={Profile} />
              <Route path="/admin"> {user.is_mentor ? <AdminDashboard /> : null} </Route >
            </Switch>
          )}
        </>
)};

export default App;