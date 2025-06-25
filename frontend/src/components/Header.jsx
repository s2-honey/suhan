// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useDrawerStore } from '../stores/useDrawerStore';

const Header = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const openDrawer = useDrawerStore((state) => state.openDrawer);

  return (
    <header className="header">
      <h1 className="header-logo" style={{ fontFamily: 'Tadak' }}>
        Milo.
      </h1>
      <div className="header-icons">
        <button
          className="header-icon"
          onClick={() => navigate('/mind-drawer')}
        >
          🤍
        </button>
        <button className="header-icon" onClick={onDrawerToggle}>
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
