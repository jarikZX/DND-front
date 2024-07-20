import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSessions, createSession, joinSession, leaveSession, fetchMaps, fetchCharacters } from '../api';
import io from 'socket.io-client';
import './Modal.css'; 
import './Sessions.css'; 

const socket = io('http://localhost:3000');

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionPassword, setNewSessionPassword] = useState('');
  const [newSessionDescription, setNewSessionDescription] = useState('');
  const [maps, setMaps] = useState<any[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<number | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [joinSessionPassword, setJoinSessionPassword] = useState<string | undefined>(undefined);
  const [showJoinPasswordField, setShowJoinPasswordField] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const getSessions = async () => {
    try {
      const fetchedSessions = await fetchSessions();
      setSessions(Array.isArray(fetchedSessions) ? fetchedSessions : []);
    } catch (error) {
      console.error('Failed to fetch sessions', error);
      setSessions([]);
    }
  };

  const getMaps = async () => {
    try {
      const response = await fetchMaps();
      if (Array.isArray(response.data)) {
        setMaps(response.data);
      } else {
        console.error('Maps data is not an array:', response.data);
        setMaps([]);
      }
    } catch (error) {
      console.error('Failed to fetch maps', error);
      setMaps([]);
    }
  };

  const getCharacters = async () => {
    try {
      const response = await fetchCharacters();
      if (Array.isArray(response.data)) {
        setCharacters(response.data);
      } else {
        console.error('Characters data is not an array:', response.data);
        setCharacters([]);
      }
    } catch (error) {
      console.error('Failed to fetch characters', error);
      setCharacters([]);
    }
  };

  useEffect(() => {
    getSessions();
    getMaps();
    getCharacters();

    socket.on('sessionDeleted', (sessionId: string) => {
      alert(`Session ${sessionId} has been deleted due to inactivity.`);
      getSessions();
    });

    return () => {
      socket.off('sessionDeleted');
    };
  }, []);

  const handleCreateSession = async () => {
    try {
      if (selectedMapId === null || selectedCharacterId === null) {
        alert('Please select a map and a character');
        return;
      }
      const newSession = await createSession({
        name: newSessionName,
        password: newSessionPassword,
        description: newSessionDescription,
        mapId: selectedMapId,
        characterId: selectedCharacterId,
      });
      if (newSession && newSession.id) {
        socket.emit('joinSession', newSession.id);
        navigate(`/sessions/${newSession.id}`);
      } else {
        console.error('Session creation failed, no session ID returned');
        alert('Failed to create session');
      }
    } catch (error) {
      console.error('Failed to create session', error);
      alert('Failed to create session');
    }
  };

  const handleJoinSession = async (id: number) => {
    try {
      if (selectedCharacterId === null) {
        alert('Please select a character');
        return;
      }
      await joinSession(id, joinSessionPassword, selectedCharacterId);
      socket.emit('joinSession', id);
      navigate(`/sessions/${id}`);
    } catch (error) {
      console.error('Failed to join session', error);
      alert('Failed to join session');
    }
  };

  const handleSessionClick = (id: number, hasPassword: boolean) => {
    if (hasPassword) {
      setShowJoinPasswordField(id);
    } else {
      handleJoinSession(id);
    }
  };

  return (
    <div className="sessions-container">
      <h1>Список игр</h1>
      <div className="create-session">
        <button className="button-primary" onClick={() => setIsModalOpen(true)}>Создать игру</button>
      </div>

      {sessions.length > 0 ? (
        <ul className="session-list">
          {sessions.map((session) => (
            <li key={session.id} className="session-item">
              <span
                onClick={() => handleSessionClick(session.id, !!session.password)}
                className="session-name"
              >
                {session.name} ({session.participants.length} Количество игроков)
              </span>
              {session.password && <span>🔒</span>}
              {showJoinPasswordField === session.id && (
                <input
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setJoinSessionPassword(e.target.value || undefined)}
                  className="password-input"
                />
              )}
              <select className="character-select" onChange={(e) => setSelectedCharacterId(Number(e.target.value))}>
                <option value="">Выбор персонажа</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
              <button className="button-secondary" onClick={() => handleJoinSession(session.id)}>Присоедениться</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Игр пока что нет</p>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Создание игры</h2>
            <input
              type="text"
              placeholder="Название игры"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              className="input-field"
            />
            <input
              type="Пароль игры"
              placeholder="Password"
              value={newSessionPassword}
              onChange={(e) => setNewSessionPassword(e.target.value)}
              className="input-field"
            />
            <textarea
              placeholder="Описание игры"
              value={newSessionDescription}
              onChange={(e) => setNewSessionDescription(e.target.value)}
              className="textarea-field"
            />
            <select className="select-field" onChange={(e) => setSelectedMapId(Number(e.target.value))}>
              <option value="">Выбор карты</option>
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name}
                </option>
              ))}
            </select>
            <select className="select-field" onChange={(e) => setSelectedCharacterId(Number(e.target.value))}>
              <option value="">Выбор персонажа</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
            <button className="button-primary" onClick={handleCreateSession}>Создать игру</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
