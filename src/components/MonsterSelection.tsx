import React, { useState, useEffect } from 'react';
import { fetchMonsters } from '../api';
import { Monster } from '../types';

interface MonsterSelectionProps {
  onSelectMonster: (monster: Monster) => void;
}

const MonsterSelection: React.FC<MonsterSelectionProps> = ({ onSelectMonster }) => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMonsters = async () => {
      try {
        const monsterList = await fetchMonsters();
        setMonsters(monsterList);
      } catch (error) {
        console.error('Error fetching monsters:', error);
      } finally {
        setLoading(false);
      }
    };
    getMonsters();
  }, []);

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  if (loading) {
    return <p>Загрузка монстров...</p>;
  }

  return (
    <div className="monster-selection">
      <h2>Выбрать монстра</h2>
      <div className="monster-grid">
        {monsters.map(monster => {
          const base64Flag = 'data:image/png;base64,';
          const imageStr = arrayBufferToBase64(monster.icon.data);
          const imageUrl = base64Flag + imageStr;
          return (
            <img
              key={monster.id}
              src={imageUrl}
              alt={monster.name}
              width="50"
              height="50"
              onClick={() => onSelectMonster(monster)}
              style={{ cursor: 'pointer', margin: '10px' }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MonsterSelection;
