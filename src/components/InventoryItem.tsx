import React from 'react';
import { Armor, Weapon, Consumable } from '../types';

interface InventoryItemProps {
  itemType: 'armor' | 'weapon' | 'consumable';
  item: Armor | Weapon | Consumable;
}

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const InventoryItem: React.FC<InventoryItemProps> = ({ itemType, item }) => {
  const getTooltip = () => {
    let baseInfo = `${item.name}\n${item.description || 'Описание не найдено'}\nКачество: ${item.quality || 'Не указано'}`;
    if ('defense' in item) {
      baseInfo += `\nЗащита: ${item.defense}`;
    }
    if ('attack' in item) {
      baseInfo += `\nАтака: ${item.attack}`;
    }
    if ('effect' in item) {
      baseInfo += `\nЭффект: ${item.effect}`;
    }
    return baseInfo;
  };

  return (
    <div className="inventory-item" title={getTooltip()}>
      <img src={`data:${item.icon.type};base64,${arrayBufferToBase64(item.icon.data)}`} alt={item.name} />
      <span>{item.name}</span>
    </div>
  );
};

export default InventoryItem;