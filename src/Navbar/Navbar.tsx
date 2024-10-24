import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoClose, IoMenu } from 'react-icons/io5';
import './Navbar.css';
import { useAuth } from '../utils/AuthContext';
import api from '../utils/api';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, userType } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      logout();
      navigate('/user-type-selection');
    } catch (err) {
      console.error(err);
    }
  };

  const unauthenticatedNavItems = [
    { to: "/", text: "Home" },
    { to: "/about-us", text: "Tungkol sa Amin" },
  ];

  const studentNavItems = [
    { to: "/play", text: "Maglaro" },
    { to: "/learn", text: "Matuto" },
    { to: "/about-us", text: "Tungkol sa Amin" },
    { to: "/assessment", text: "Pagsusulit" },
  ];

  const teacherNavItems = [
    { to: "/play", text: "Maglaro" },
    { to: "/learn", text: "Matuto" },
    { to: "/teacher-corner", text: "Gabay sa Pagtuturo" },
    { to: "/about-us", text: "Tungkol sa Amin" },
    { to: "/assessment", text: "Pagsusulit" },
    { to: "/my-account", text: "Iyong Account" },
  ];

  let navItems;
  if (!isAuthenticated) {
    navItems = unauthenticatedNavItems;
  } else if (userType === 'student') {
    navItems = studentNavItems;
  } else {
    navItems = teacherNavItems;
  }

  return (
    <header className="header">
      <nav className="nav container">
      <img src="/KathaLogo.webp" alt="Image" style={{width:"4rem"}}/>
        <NavLink to="/" className="nav__logo">
          Katha
        </NavLink>
        <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav-menu">
          <ul className="nav__list">
            {navItems.map((item, index) => (
              <li key={index} className="nav__item">
                <NavLink to={item.to} className="nav__link" onClick={closeMenuOnMobile}>
                  {item.text}
                </NavLink>
              </li>
            ))}
            {isAuthenticated ? (
              <li className="nav__item">
                <button onClick={handleLogout} className="nav__link nav__cta" id='loginBtn'>
                  Mag-logout
                </button>
              </li>
            ) : (
              <li className="nav__item">
                <NavLink to="/user-type-selection" className="nav__link nav__cta" id='loginBtn'>
                  Mag-login
                </NavLink>
              </li>
            )}
          </ul>
          <div className="nav__close" id="nav-close" onClick={toggleMenu}>
            <IoClose />
          </div>
        </div>
        <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
          <IoMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;