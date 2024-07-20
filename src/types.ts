export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Monster {
  id: number;
  name: string;
  damage: number;
  health: number;
  type: string;
  icon: {
    type: string;
    data: ArrayBuffer;
  };
  isFading?: boolean;
  maxHealth: number;
  positionX: number;
  positionY: number;
}

export interface Character {
  id?: number;
  name: string;
  level: number;
  classId?: number;
  strength: number;
  agility: number;
  endurance: number;
  intellect: number;
  background: string;
  movementRange: number;
  isOpen?: boolean;
  inventory?: InventoryItem[];
  equipment?: Equipment;
  helmet?: Armor;
  chestplate?: Armor;
  ring1?: Armor;
  ring2?: Armor;
  amulet?: Armor;
  pants?: Armor;
  gloves?: Armor;
  boots?: Armor;
  weapon?: Weapon;
  shield?: Armor;
  positionX?: number;
  positionY?: number;
  class?: Class; 
  iconUrl?: string;
  isFading?: boolean;
  maxHealth: number;

}

export interface Class {
  id: number;
  name: string;
  description?: string;
  icon: {
    type: string;
    data: ArrayBuffer;
  };
}

export interface Armor {
  id: number;
  name: string;
  defense: number;
  type: 'helmet' | 'chestplate' | 'ring' | 'amulet' | 'pants' | 'gloves' | 'boots' | 'shield';
  description: string;
  quality: string;
  icon: {
    type: string;
    data: ArrayBuffer;
  };
}

export interface Weapon {
  id: number;
  name: string;
  attack: number;
  description: string;
  quality: string;
  type: 'melee' | 'ranged' | 'magic';
  icon: {
    type: string;
    data: ArrayBuffer;
  };
  classId?: number;
}

export interface Consumable {
  id: number;
  name: string;
  effect: string;
  description: string;
  quality: string;
  icon: {
    type: string;
    data: ArrayBuffer;
  };
  classId?: number;
}

export interface InventoryItem {
  id: number;
  itemType: 'armor' | 'weapon' | 'consumable';
  itemId: number;
  quantity: number;
  slot: number;
  characterId: number;
  icon: {
    type: string;
    data: ArrayBuffer;
  };
  ArmorItem?: Armor;
  WeaponItem?: Weapon;
  ConsumableItem?: Consumable;
}

export interface Equipment {
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
}

export interface Spell {
  id: number;
  spellName: string;
  power: number;
  characterId: number;
  icon: {
    type: string;
    data: ArrayBuffer;
  };
}

export interface Map {
  id: number;
  name: string;
  grid: string; 
  objects: string;
  icons: string;
  textures: string;
  userId: number;
}

export interface Session {
  id: number;
  name: string;
  description: string;
  password?: string;
  userId: number;
}
