
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const fetchCharacterWithClass = async (characterId: number) => {
  const response = await axios.get(`/characters/${characterId}/with-class`);
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  return axios.post('/auth/register', { username, email, password });
};

export const login = async (email: string, password: string) => {
  return axios.post('/auth/login', { email, password });
};

export const fetchProfile = async () => {
  return axios.get('/profile');
};

export const updateProfile = async (username: string, email: string) => {
  return axios.put('/profile', { username, email });
};

export const fetchCharacter = async (characterId: number) => {
  const response = await axios.get(`/characters/${characterId}`);
  return response.data;
};
export const fetchCharacters = async () => {
  return axios.get('/characters');
};

export const createCharacter = async (character: any) => {
  return axios.post('/characters', character);
};

export const updateCharacter = async (id: number, character: any) => {
  return axios.put(`/characters/${id}`, character);
};

export const deleteCharacter = async (id: number) => {
  return axios.delete(`/characters/${id}`);
};



export const createMonster = async (monster: any) => {
  return axios.post('/monsters', monster);
};

export const fetchSpellsForCharacter = async (characterId: number) => {
  const response = await axios.get(`/spells/character/${characterId}`);
  return response.data;
};

export const fetchSpellsForMonster = async (monsterId: number) => {
  const response = await axios.get(`/spells/monster/${monsterId}`);
  return response.data;
};

export const fetchMonsters = async () => {
  const response = await axios.get('/monsters');
  return response.data;
};


export const fetchClasses = async () => {
  return axios.get('/classes');
};
export const fetchClass = async (classId: number) => {
  const response = await axios.get(`/classes/${classId}`);
  return response.data;
};;


export const fetchArmors = async () => {
  return axios.get('/armors');
};

export const createArmor = async (armor: any) => {
  return axios.post('/armors', armor);
};

export const updateArmor = async (id: number, armor: any) => {
  return axios.put(`/armors/${id}`, armor);
};

export const deleteArmor = async (id: number) => {
  return axios.delete(`/armors/${id}`);
};


export const fetchWeapons = async () => {
  return axios.get('/weapons');
};

export const createWeapon = async (weapon: any) => {
  return axios.post('/weapons', weapon);
};

export const updateWeapon = async (id: number, weapon: any) => {
  return axios.put(`/weapons/${id}`, weapon);
};

export const deleteWeapon = async (id: number) => {
  return axios.delete(`/weapons/${id}`);
};


export const fetchConsumables = async () => {
  return axios.get('/consumables');
};

export const createConsumable = async (consumable: any) => {
  return axios.post('/consumables', consumable);
};

export const updateConsumable = async (id: number, consumable: any) => {
  return axios.put(`/consumables/${id}`, consumable);
};

export const deleteConsumable = async (id: number) => {
  return axios.delete(`/consumables/${id}`);
};



export const fetchInventory = async (characterId: number) => {
  return axios.get(`/inventory/${characterId}`);
};

export const addItemToInventory = async (item: any) => {
  return axios.post('/inventory', item);
};

export const updateInventoryItem = async (id: number, item: any) => {
  return axios.put(`/inventory/${id}`, item);
};

export const deleteInventoryItem = async (id: number) => {
  return axios.delete(`/inventory/${id}`);
};


export const updateCharacterEquipment = async (characterId: number, equipment: any) => {
  return axios.put(`/characters/${characterId}/equipment`, { equipment });
};



export const moveItemToInventory = async (characterId: number, itemId: number, slotIndex: number, itemType: string) => {
  return await axios.post(`/characters/${characterId}/move-to-inventory`, {
    itemId,
    slotIndex,
    itemType,
  });
};

export const moveItemToEquipment = async (characterId: number, itemId: number, equipmentSlot: string, itemType: string) => {
  return await axios.post(`/characters/${characterId}/move-to-equipment`, {
    itemId,
    equipmentSlot,
    itemType,
  });
};


export const fetchMaps = async () => {
  return axios.get('/maps');
};

export const createMap = async (map: any) => {
  return axios.post('/maps', map);
};

export const updateMap = async (id: number, map: any) => {
  return axios.put(`/maps/${id}`, map);
};

export const deleteMap = async (id: number) => {
  return axios.delete(`/maps/${id}`);
};



export const fetchSessions = async () => {
  const response = await axios.get('/sessions');
  return response.data;
};

export const createSession = async (sessionData: { name: string; password?: string; description: string; mapId: number; characterId: number }) => {
  const response = await axios.post('/sessions', sessionData);
  return response.data;
};

export const joinSession = async (id: number, password?: string, characterId?: number) => {
  const response = await axios.post(`/sessions/${id}/join`, { password, characterId });
  return response.data;
};

export const leaveSession = async (id: number) => {
  return axios.delete(`/sessions/${id}/leave`);
};

export const fetchSession = async (id: string) => {
  const response = await axios.get(`/sessions/${id}`);
  return response.data;
};

export const updateSession = async (id: number, session: any) => {
  return axios.put(`/sessions/${id}`, session);
};

export const deleteSession = async (id: number) => {
  return axios.delete(`/sessions/${id}`);
};

export const createTestSession = async () => {
  const response = await axios.post(`${API_URL}/createTestSession`);
  return response.data;
};


export const fetchSpells = async (characterId: number) => {
  return axios.get(`/spells/${characterId}`);
};

export const addSpell = async (spell: any) => {
  return axios.post('/spells', spell);
};

export const updateSpell = async (id: number, spell: any) => {
  return axios.put(`/spells/${id}`, spell);
};

export const deleteSpell = async (id: number) => {
  return axios.delete(`/spells/${id}`);
};

export {};
