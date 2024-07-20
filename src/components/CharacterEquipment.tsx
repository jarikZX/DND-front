
import React, { useState } from 'react';
import { Armor, Weapon } from '../types';

interface CharacterEquipmentProps {
  equipment: {
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
  };
  equipmentSlots: Record<string, string>;
  armors: Armor[];
  weapons: Weapon[];
  handleEquipmentChange: (slot: keyof CharacterEquipmentProps['equipment'], item: Armor | Weapon) => void;
  arrayBufferToBase64: (buffer: ArrayBuffer) => string;
  classId: number | null;
}

const CharacterEquipment: React.FC<CharacterEquipmentProps> = ({
  equipment,
  equipmentSlots,
  armors,
  weapons,
  handleEquipmentChange,
  arrayBufferToBase64,
  classId,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<keyof CharacterEquipmentProps['equipment'] | null>(null);

  const toggleSlotSelection = (slot: keyof CharacterEquipmentProps['equipment']) => {
    setSelectedSlot(prevSlot => (prevSlot === slot ? null : slot));
  };

  const handleSelectChange = (item: Armor | Weapon, slot: keyof CharacterEquipmentProps['equipment']) => {
    handleEquipmentChange(slot, item);
    setSelectedSlot(null);
  };

  const renderEquipmentSlot = (slot: keyof CharacterEquipmentProps['equipment'], type: string, className: string) => {
    const item = armors.find(armor => armor.id === equipment[slot]) || weapons.find(weapon => weapon.id === equipment[slot]);

    const items = type === 'ring' ? armors.filter(armor => armor.type === 'ring') :
                  type === 'helmet' ? armors.filter(armor => armor.type === 'helmet') :
                  type === 'chestplate' ? armors.filter(armor => armor.type === 'chestplate') :
                  type === 'amulet' ? armors.filter(armor => armor.type === 'amulet') :
                  type === 'pants' ? armors.filter(armor => armor.type === 'pants') :
                  type === 'gloves' ? armors.filter(armor => armor.type === 'gloves') :
                  type === 'boots' ? armors.filter(armor => armor.type === 'boots') :
                  type === 'weapon' ? weapons :
                  type === 'shield' ? armors.filter(armor => armor.type === 'shield') :
                  [];

    const getTooltip = (item: Armor | Weapon) => {
      const baseInfo = `${item.name}\n${item.description}\nКачество: ${item.quality}`;
      if ('defense' in item) {
        return `${baseInfo}\nЗащита: ${item.defense}`;
      }
      if ('attack' in item) {
        return `${baseInfo}\nАтака: ${item.attack}`;
      }
      return baseInfo;
    };

    return (
      <div key={slot} className={`equipment-slot ${className}`} onClick={() => toggleSlotSelection(slot)}>
        <span>{equipmentSlots[slot]}</span>
        {item ? (
          <img
            src={`data:image/png;base64,${arrayBufferToBase64(item.icon.data)}`}
            alt={item.name}
            title={getTooltip(item)}
            className="equipment-item"
            style={{ width: '64px', height: '64px' }} 
          />
        ) : (
          <div className="empty-slot">+</div>
        )}
        {selectedSlot === slot && (
          <div className="items-grid">
            {items.map(item => (
              <div key={item.id} className="item-option" onClick={() => handleSelectChange(item, slot)}>
                <img
                  src={`data:image/png;base64,${arrayBufferToBase64(item.icon.data)}`}
                  alt={item.name}
                  title={getTooltip(item)}
                  style={{ width: '64px', height: '64px' }} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="equipment">
      <h2>Снаряжение</h2>
      <div className="equipment-grid">
        {renderEquipmentSlot('helmet', 'helmet', 'helmet')}
        {renderEquipmentSlot('amulet', 'amulet', 'amulet')}
        {renderEquipmentSlot('weapon', 'weapon', 'weapon')}
        {renderEquipmentSlot('chestplate', 'chestplate', 'chestplate')}
        {renderEquipmentSlot('shield', 'shield', 'shield')}
        {renderEquipmentSlot('ring1', 'ring', 'ring1')}
        {renderEquipmentSlot('ring2', 'ring', 'ring2')}
        {renderEquipmentSlot('pants', 'pants', 'pants')}
        {renderEquipmentSlot('gloves', 'gloves', 'gloves')}
        {renderEquipmentSlot('boots', 'boots', 'boots')}
      </div>
    </div>
  );
};

export default CharacterEquipment;
