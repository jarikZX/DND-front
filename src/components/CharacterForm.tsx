
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCharacter, addItemToInventory, fetchClasses, fetchArmors, fetchWeapons, fetchConsumables } from '../api';
import { Class, Armor, Weapon, Consumable } from '../types';
import CharacterAttributes from './CharacterAttributes';
import CharacterInventory from './CharacterInventory';
import CharacterEquipment from './CharacterEquipment';
import './CreateCharacter.css';

const CharacterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState<number | null>(null);
  const [strength, setStrength] = useState(0);
  const [agility, setAgility] = useState(0);
  const [endurance, setEndurance] = useState(0);
  const [intellect, setIntellect] = useState(0);
  const [background, setBackground] = useState('');
  const [movementRange, setMovementRange] = useState(0);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classIcon, setClassIcon] = useState<string | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<{
    helmet?: number;
    chestplate?: number;
    ring1?: number;
    ring2?: number;
    amulet?: number;
    pants?: number;
    gloves?: number;
    boots?: number;
    weapon?: number;
    shield?: number;
  }>({});
  const [armors, setArmors] = useState<Armor[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getClasses = async () => {
      try {
        const response = await fetchClasses();
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch classes', error);
      }
    };

    const getArmors = async () => {
      try {
        const response = await fetchArmors();
        setArmors(response.data);
      } catch (error) {
        console.error('Failed to fetch armors', error);
      }
    };

    const getWeapons = async () => {
      try {
        const response = await fetchWeapons();
        setWeapons(response.data);
      } catch (error) {
        console.error('Failed to fetch weapons', error);
      }
    };

    getClasses();
    getArmors();
    getWeapons();
  }, []);

  useEffect(() => {
    const getConsumables = async () => {
      try {
        const response = await fetchConsumables();
        const healthPotion = response.data.find((consumable: Consumable) => consumable.name === 'Зелье лечения');
        const quiver = response.data.find((consumable: Consumable) => consumable.name === 'Колчан со стрелами');

        let newInventory: any[] = [];
        if (classId !== null) {
          if (healthPotion) newInventory.push({ ...healthPotion, itemType: 'consumable', quantity: 1, slot: 0 });

          if (classes.find(cls => cls.id === classId)?.name === 'hunter' && quiver) {
            newInventory.push({ ...quiver, itemType: 'consumable', quantity: 1, slot: 1 });
          }
        }

        setInventory(newInventory);
      } catch (error) {
        console.error('Failed to fetch consumables', error);
      }
    };

    getConsumables();
  }, [classId, classes]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClassId = parseInt(e.target.value);
    setClassId(selectedClassId || null);
    const selectedClass = classes.find((cls: Class) => cls.id === selectedClassId);
    if (selectedClass && selectedClass.icon) {
      const base64Flag = 'data:image/png;base64,';
      const imageStr = arrayBufferToBase64(selectedClass.icon.data);
      setClassIcon(base64Flag + imageStr);

   
      const weapon = weapons.find(w => w.classId === selectedClassId);
      setEquipment(prevState => ({ ...prevState, weapon: weapon ? weapon.id : undefined }));
    } else {
      setClassIcon(null);
      setEquipment(prevState => ({ ...prevState, weapon: undefined }));
    }
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

  const handleEquipmentChange = (slot: keyof typeof equipment, item: Armor | Weapon) => {
    setEquipment((prevState) => ({ ...prevState, [slot]: item.id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const characterData = {
        name,
        level: 1,
        classId: classId ?? undefined,
        strength,
        agility,
        endurance,
        intellect,
        background,
        movementRange,
        equipment,
      };

      const response = await createCharacter(characterData);
      const characterId = response.data.id;

    
      for (const item of inventory) {
        await addItemToInventory({
          characterId,
          itemType: item.itemType,
          itemId: item.id,
          quantity: item.quantity ?? 1,
          slot: item.slot ?? 0
        });
      }

      alert('Character created successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Failed to create character', error);
      alert('Failed to create character');
    }
  };
  const equipmentSlots: Record<string, string> = {
    helmet: 'Шлем',
    chestplate: 'Нагрудник',
    ring1: 'Кольцо 1',
    ring2: 'Кольцо 2',
    amulet: 'Амулет',
    pants: 'Поножи',
    gloves: 'Перчатки',
    boots: 'Сапоги',
    weapon: 'Оружие',
    shield: 'Щит',
  };

  return (
    <form className="character-form" onSubmit={handleSubmit}>
      <CharacterAttributes
        name={name}
        setName={setName}
        classId={classId}
        handleClassChange={handleClassChange}
        classes={classes}
        classIcon={classIcon}
        strength={strength}
        setStrength={setStrength}
        agility={agility}
        setAgility={setAgility}
        endurance={endurance}
        setEndurance={setEndurance}
        intellect={intellect}
        setIntellect={setIntellect}
        background={background}
        setBackground={setBackground}
        movementRange={movementRange}
        setMovementRange={setMovementRange}
      />
      <CharacterInventory inventory={inventory} arrayBufferToBase64={arrayBufferToBase64} />
      <CharacterEquipment
        equipment={equipment}
        equipmentSlots={equipmentSlots}
        armors={armors}
        weapons={weapons.filter(weapon => weapon.classId === classId)}
        handleEquipmentChange={handleEquipmentChange}
        arrayBufferToBase64={arrayBufferToBase64}
        classId={classId}
      />
      <button type="submit">Создать персонажа</button>
    </form>
  );
};

export default CharacterForm;
