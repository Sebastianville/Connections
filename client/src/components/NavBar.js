import React from "react";
import { NavLink } from "react-router-dom";

function NavBar(){

    return (
        <header className="navbar">
          <nav>
            <ul className="nav-links">
              <li className="nav-item"><NavLink to="/" className="nav-link" activeClassName="active">Home</NavLink></li>
              <li className="nav-item"><NavLink to="/college" className="nav-link" activeClassName="active">College</NavLink></li>
              <li className="nav-item"><NavLink to="/favorite" className="nav-link" activeClassName="active">Favorite</NavLink></li>
              <li className="nav-item"><NavLink to="/favorite" className="nav-link" activeClassName="active">Profile</NavLink></li>
              <li className="nav-item"><NavLink to="/admin-dash-board" className="nav-link" activeClassName="active">Admin Dash Board</NavLink></li>
            </ul>
          </nav>
        </header>
      );
    }

export default NavBar;
    