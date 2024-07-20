import React from 'react';
import './Modal.css';

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, children, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="button-secondary">Нет</button>
          <button onClick={onConfirm} className="button-primary">Да</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
