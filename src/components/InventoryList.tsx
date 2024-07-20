import React, { useState } from 'react';
import { InventoryItem } from '../types';
import Item from './Item';
import Modal from './Modal';
import { updateInventoryItem, deleteInventoryItem } from '../api';

interface InventoryListProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryList: React.FC<InventoryListProps> = ({ inventory, setInventory }) => {
  const [draggedItem, setDraggedItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const slots = Array(10).fill(null);
  inventory.forEach((item) => {
    slots[item.slot] = item;
  });

  const handleDragStart = (item: InventoryItem) => {
    setDraggedItem(item);
  };

  const handleDrop = async (slotIndex: number) => {
    if (draggedItem && draggedItem.slot !== slotIndex && !slots[slotIndex]) {
      try {
        await updateInventoryItem(draggedItem.id, { ...draggedItem, slot: slotIndex });

     
        const updatedInventory = inventory.map((item) => 
          item.id === draggedItem.id ? { ...item, slot: slotIndex } : item
        );
        setInventory(updatedInventory);
      } catch (error) {
        console.error('Failed to update inventory slot', error);
      }
    }
    setDraggedItem(null);
  };

  const handleDelete = async (itemId: number) => {
    try {
      await deleteInventoryItem(itemId);
      setInventory(inventory.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete inventory item', error);
    }
  };

  const openModal = (item: InventoryItem) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete.id);
      closeModal();
    }
  };

  return (
    <div className="inventory">
      <h3>Инвентарь</h3>
      <div className="inventory-grid">
        {slots.map((slot, index) => (
          <div
            key={index}
            className="inventory-slot"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
          >
            {slot && (
              <div
                draggable
                onDragStart={() => handleDragStart(slot)}
                className="inventory-item-wrapper"
              >
                {slot.itemType === 'armor' && slot.ArmorItem && (
                  <Item itemType="armor" item={slot.ArmorItem} />
                )}
                {slot.itemType === 'weapon' && slot.WeaponItem && (
                  <Item itemType="weapon" item={slot.WeaponItem} />
                )}
                {slot.itemType === 'consumable' && slot.ConsumableItem && (
                  <Item itemType="consumable" item={slot.ConsumableItem} />
                )}
                <button
                  className="delete-button"
                  onClick={() => openModal(slot)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        show={showModal}
        onClose={closeModal}
        onConfirm={confirmDelete}
      >
        <p>Вы точно собираетесь удалить предмет?</p>
      </Modal>
    </div>
  );
};

export default InventoryList;
