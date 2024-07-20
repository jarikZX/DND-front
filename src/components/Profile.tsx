import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile, fetchCharacters, deleteCharacter, fetchClasses, fetchInventory } from '../api';
import { InventoryItem } from '../types';
import Item from './Item';
import InventoryList from './InventoryList';
import './Profile.css';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [characters, setCharacters] = useState<any[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchProfile();
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    const getCharacters = async () => {
      try {
        const response = await fetchCharacters();
        setCharacters(response.data);
      } catch (error) {
        console.error('Failed to fetch characters', error);
      }
    };

    const getClasses = async () => {
      try {
        const response = await fetchClasses();
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch classes', error);
      }
    };

    getProfile();
    getCharacters();
    getClasses();
  }, []);

  const toggleCharacterDetails = async (index: number) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((char, i) =>
        i === index ? { ...char, isOpen: !char.isOpen } : { ...char, isOpen: false }
      )
    );

    const character = characters[index];
    if (!character.isOpen) {
      try {
        const response = await fetchInventory(character.id);
        setInventory(response.data);
      } catch (error) {
        console.error('Failed to fetch inventory', error);
      }
    } else {
      setInventory([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(username, email);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handleCreateCharacter = () => {
    navigate('/create-character');
  };

  const handleCreateMap = () => {
    navigate('/map-editor');
  };

  const handleFindSessions = () => {
    navigate('/sessions');
  };

  const handleDeleteCharacter = async (id: number) => {
    try {
      await deleteCharacter(id);
      setCharacters((prevCharacters) => prevCharacters.filter((char) => char.id !== id));
      alert('Character deleted successfully');
    } catch (error) {
      console.error('Failed to delete character', error);
      alert('Failed to delete character');
    }
  };

  const getClassById = (classId: number) => {
    const classObj = classes.find((cls) => cls.id === classId);
    return classObj ? classObj.name : 'Unknown';
  };

  const getClassIconById = (classId: number) => {
    const classObj = classes.find((cls) => cls.id === classId);
    if (classObj && classObj.icon) {
      const base64Flag = 'data:image/png;base64,';
      const imageStr = arrayBufferToBase64(classObj.icon.data);
      return base64Flag + imageStr;
    }
    return undefined;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  if (isLoading) {
    return <div className="loading">Загрузка профиля...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Профиль</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Имя пользователя</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <button type="submit" className="button-primary">Обновить профиль</button>
      </form>
      <div className="action-buttons">
        <button className="button-secondary" onClick={handleCreateCharacter}>Создать персонажа</button>
        <button className="button-secondary" onClick={handleCreateMap}>Создать карту</button>
        <button className="button-secondary" onClick={handleFindSessions}>Найти игру</button>
      </div>
      <h2>Персонажы</h2>
      <ul className="character-list">
        {characters.map((character, index) => (
          <li key={`${character.id}-${index}`} className="character-item">
            <div onClick={() => toggleCharacterDetails(index)} className="character-header">
              {character.name}
            </div>
            {character.isOpen && (
              <div className="character-details">
                <p>Уровень: {character.level}</p>
                <p>Класс: {getClassById(character.classId)}</p>
                {getClassIconById(character.classId) && (
                  <img src={getClassIconById(character.classId)!} alt="Class Icon" className="class-icon" />
                )}
                <p>Сила: {character.strength}</p>
                <p>Ловкость: {character.agility}</p>
                <p>Выносливость: {character.endurance}</p>
                <p>Интелект: {character.intellect}</p>
                <p>История: {character.background}</p>
                <p>Дальность перемещения: {character.movementRange}</p>
                <InventoryList inventory={inventory} setInventory={setInventory} />
                <h3>Снаряжение</h3>
                <div className="equipment-grid">
                  {character.Helmet && character.Helmet.icon && (
                    <div className="equipment-slot" data-slot="Helmet">
                      <Item itemType="armor" item={character.Helmet} />
                    </div>
                  )}
                  {character.Chestplate && character.Chestplate.icon && (
                    <div className="equipment-slot" data-slot="Chestplate">
                      <Item itemType="armor" item={character.Chestplate} />
                    </div>
                  )}
                  {character.Ring1 && character.Ring1.icon && (
                    <div className="equipment-slot" data-slot="Ring 1">
                      <Item itemType="armor" item={character.Ring1} />
                    </div>
                  )}
                  {character.Ring2 && character.Ring2.icon && (
                    <div className="equipment-slot" data-slot="Ring 2">
                      <Item itemType="armor" item={character.Ring2} />
                    </div>
                  )}
                  {character.Amulet && character.Amulet.icon && (
                    <div className="equipment-slot" data-slot="Amulet">
                      <Item itemType="armor" item={character.Amulet} />
                    </div>
                  )}
                  {character.Pants && character.Pants.icon && (
                    <div className="equipment-slot" data-slot="Pants">
                      <Item itemType="armor" item={character.Pants} />
                    </div>
                  )}
                  {character.Gloves && character.Gloves.icon && (
                    <div className="equipment-slot" data-slot="Gloves">
                      <Item itemType="armor" item={character.Gloves} />
                    </div>
                  )}
                  {character.Boots && character.Boots.icon && (
                    <div className="equipment-slot" data-slot="Boots">
                      <Item itemType="armor" item={character.Boots} />
                    </div>
                  )}
                  {character.Weapon && character.Weapon.icon && (
                    <div className="equipment-slot" data-slot="Weapon">
                      <Item itemType="weapon" item={character.Weapon} />
                    </div>
                  )}
                  {character.Shield && character.Shield.icon && (
                    <div className="equipment-slot" data-slot="Shield">
                      <Item itemType="armor" item={character.Shield} />
                    </div>
                  )}
                </div>
                <button className="button-danger" onClick={() => handleDeleteCharacter(character.id)}>Удалить персонажа</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
