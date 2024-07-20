import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './routes';
import Header from './components/Header';
import { UserProvider } from './contexts/UserContext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <RoutesComponent />
      </Router>
    </UserProvider>
  );
};

export default App;
