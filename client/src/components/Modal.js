import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>X</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;