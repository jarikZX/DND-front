import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Header.css';

const Header: React.FC = () => {
  const { username, setUsername } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = !!username;

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/profile" className="nav-link">Профиль</Link>
        <Link to="/maps" className="nav-link">Мои Карты</Link>
        <Link to="/sessions" className="nav-link">Сессии</Link>
      </nav>
      <div className="auth-section">
        {isAuthenticated ? (
          <>
            <span className="username">{username}</span>
            <button onClick={handleLogout} className="button-logout">Выход</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">Вход</Link>
            <Link to="/register" className="auth-link">Регистрация</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
