import React from 'react';
import { Class } from '../types';
import './characterAttrivutes.css'
interface CharacterAttributesProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  classId: number | null;
  handleClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  classes: Class[];
  classIcon: string | null;
  strength: number;
  setStrength: React.Dispatch<React.SetStateAction<number>>;
  agility: number;
  setAgility: React.Dispatch<React.SetStateAction<number>>;
  endurance: number;
  setEndurance: React.Dispatch<React.SetStateAction<number>>;
  intellect: number;
  setIntellect: React.Dispatch<React.SetStateAction<number>>;
  background: string;
  setBackground: React.Dispatch<React.SetStateAction<string>>;
  movementRange: number;
  setMovementRange: React.Dispatch<React.SetStateAction<number>>;
}

const CharacterAttributes: React.FC<CharacterAttributesProps> = ({
  name,
  setName,
  classId,
  handleClassChange,
  classes,
  classIcon,
  strength,
  setStrength,
  agility,
  setAgility,
  endurance,
  setEndurance,
  intellect,
  setIntellect,
  background,
  setBackground,
  movementRange,
  setMovementRange,
}) => {
  return (
    <div className="form-section">
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <label htmlFor="charClass">Класса</label>
      <select id="charClass" value={classId?.toString() ?? ''} onChange={handleClassChange} required>
        <option value="">Выбрать класс</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id.toString()}>
            {cls.name}
          </option>
        ))}
      </select>
      {classIcon && <img className="class-icon" src={classIcon} alt="Class Icon" />}
      <label htmlFor="strength">Сила</label>
      <input
        id="strength"
        type="number"
        value={strength}
        onChange={(e) => setStrength(Number(e.target.value))}
        min="0"
        placeholder="Strength"
        required
      />
      <label htmlFor="agility">Ловкость</label>
      <input
        id="agility"
        type="number"
        value={agility}
        onChange={(e) => setAgility(Number(e.target.value))}
        min="0"
        placeholder="Agility"
        required
      />
      <label htmlFor="endurance">Выносливость</label>
      <input
        id="endurance"
        type="number"
        value={endurance}
        onChange={(e) => setEndurance(Number(e.target.value))}
        min="0"
        placeholder="Endurance"
        required
      />
      <label htmlFor="intellect">Интелект</label>
      <input
        id="intellect"
        type="number"
        value={intellect}
        onChange={(e) => setIntellect(Number(e.target.value))}
        min="0"
        placeholder="Intellect"
        required
      />
      <label htmlFor="background">История</label>
      <textarea
        id="background"
        value={background}
        onChange={(e) => setBackground(e.target.value)}
        placeholder="Background"
        required
      ></textarea>
      <label htmlFor="movementRange">Дальность перемещения</label>
      <input
        id="movementRange"
        type="number"
        value={movementRange}
        onChange={(e) => setMovementRange(Number(e.target.value))}
        min="0"
        placeholder="Movement Range"
        required
      />
    </div>
  );
};

export default CharacterAttributes;
