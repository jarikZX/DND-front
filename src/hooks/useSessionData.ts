import { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchCharacterWithClass, fetchMonsters } from '../api';
import { Monster } from '../types';

const useSessionData = (sessionId: string | undefined) => {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapData, setMapData] = useState<any>({ grid: Array.from({ length: 40 }, () => Array(40).fill(null)) });
  const [character, setCharacter] = useState<any>(null);
  const [characterPosition, setCharacterPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [spawnedMonsters, setSpawnedMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    const getSession = async (sessionId: string) => {
      try {
        const fetchedSession = await axios.get(`/sessions/${sessionId}`);
        setSession(fetchedSession.data);
        setError(null);

        if (fetchedSession.data.characterId) {
          const characterData = await fetchCharacterWithClass(fetchedSession.data.characterId);
          setCharacter(characterData);
          setCharacterPosition({ x: characterData.positionX, y: characterData.positionY });

          if (characterData.Class && characterData.Class.icon && characterData.Class.icon.data) {
            const base64Flag = `data:image/png;base64,`;
            const imageStr = arrayBufferToBase64(characterData.Class.icon.data);
            const imageUrl = base64Flag + imageStr;

            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
              setCharacterImage(img);
            };
            img.onerror = (error) => {
              console.error('Image failed to load', error);
            };
          } else {
            console.error('No icon data available for character');
          }
        }
      } catch (error) {
        console.error('Failed to fetch session', error);
        setError('Failed to fetch session');
      } finally {
        setLoading(false);
      }
    };

    const loadMap = async (mapId: string) => {
      try {
        const response = await axios.get(`/maps/${mapId}`);
        const data = response.data;
        let gridData;
        if (typeof data.grid === 'string') {
          gridData = JSON.parse(data.grid);
        } else if (Array.isArray(data.grid)) {
          gridData = data.grid;
        } else {
          throw new Error('Invalid grid data format');
        }
        setMapData({ ...data, grid: gridData });
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    const loadMonsters = async () => {
      try {
        const monstersData = await fetchMonsters();
        setMonsters(monstersData);
      } catch (error) {
        console.error('Error loading monsters:', error);
      }
    };

    if (sessionId) {
      getSession(sessionId);
      loadMonsters();
    }

    if (session?.mapId) {
      loadMap(session.mapId);
    }
  }, [sessionId, session?.mapId]);

  return {
    session,
    error,
    mapData,
    character,
    characterPosition,
    characterImage,
    monsters,
    spawnedMonsters,
    loading,
    setCharacterPosition,
    setSpawnedMonsters,
  };
};

export default useSessionData;
