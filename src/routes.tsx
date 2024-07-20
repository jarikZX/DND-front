import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import CreateCharacter from './components/CreateCharacter';
import Sessions from './components/Sessions';
import SessionInterface from './components/SessionInterface';
import MasterInterface from './components/MasterInterface';
import MapList from './components/MapList';
import MapEditor from './components/MapEditor';

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-character" element={<CreateCharacter />} />
      <Route path="/map-editor" element={<MapEditor />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/sessions/:id" element={<SessionInterface />} />
      <Route path="/master/:id" element={<MasterInterface />} />
      <Route path="/maps" element={<MapList />} />
      <Route path="/map-editor/:id" element={<MapEditor />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default RoutesComponent;
