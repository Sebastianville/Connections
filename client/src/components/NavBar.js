import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from './userContext';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: orange;
  padding: 5px 15px; 
`;

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 15px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const NavBar = () => {
  const { user, updateUser } = useContext(UserContext);
  const history = useHistory()
  const handleLogout = async () => {
    await fetch('http://localhost:5555/logout', {
      method: 'DELETE',
      credentials: 'include',
    });

    updateUser(null)
    history.push("/login")
  };

  

  return (
    <Nav>
      <NavList>
        <NavItem><NavLink to="/">Home</NavLink></NavItem>
        <NavItem><NavLink to="/college">College</NavLink></NavItem>
        {user ? (
          <>
            <NavItem><NavLink to="/profile">Profile</NavLink></NavItem>
            <NavItem><NavLink to="/favorite">Favorites</NavLink></NavItem>
            <NavItem><LogoutButton onClick={handleLogout}>Logout</LogoutButton></NavItem>
          {user.is_mentor && <NavItem><NavLink to="/admin"> Admin</NavLink></NavItem>}
          </>
        ) : (
          <NavItem><NavLink to="/login">Log In</NavLink></NavItem>
        )}
      </NavList>
    </Nav>
  );
};

export default NavBar;