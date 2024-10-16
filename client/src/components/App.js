import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider, UserContext } from './userContext';
import NavBar from './NavBar';

import Home from '../pages/Home';
import Favorite from '../pages/Favorite.Js'
import AdminDashboard from '../pages/AdminDashBoard.Js';
import Profile from '../pages/profile';
import College from '../pages/College';
import Login from './Login';


function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/college" component={College} />

         
          <UserContext.Consumer>
            {({ user }) => (
              <>
                {!user ? (
                  <Route path="/login" component={Login} />
                ) : (
                  <>
                    <Route path="/favorites" component={Favorite} />
                    <Route path="/profile" component={Profile} />
                    {user.is_mentor && <Route path="/admin" component={AdminDashboard} />}
                  </>
                )}
              </>
            )}
          </UserContext.Consumer>
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;