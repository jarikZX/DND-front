
import React from 'react';
import { Consumable } from '../types';

interface CharacterInventoryProps {
  inventory: Consumable[];
  arrayBufferToBase64: (buffer: ArrayBuffer) => string;
}

const CharacterInventory: React.FC<CharacterInventoryProps> = ({ inventory, arrayBufferToBase64 }) => {
  return (
    <div className="inventory">
      <h2>Инвентарь</h2>
      <div className="inventory-grid">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="inventory-slot">
            {inventory[index] && (
              <img
                src={`data:image/png;base64,${arrayBufferToBase64(inventory[index].icon.data)}`}
                alt={inventory[index].name}
                title={`${inventory[index].name}\n${inventory[index].effect}\n${inventory[index].description}\nКоличество: ${inventory[index].quality}`}
                className="inventory-item"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterInventory;
