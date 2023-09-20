import React from 'react';

interface ModalProps {
    onClose: () => void;
    winner: string | null;
}

const ModalWindows: React.FC<ModalProps> = ({ onClose, winner }) => {
    return (
        <div className="modal">
            <div className="modalContent">
                <h1 className="winner-result">Winner is: </h1>
                <h1 className="winner-mark">{winner}</h1>
                <button className = "modal-close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ModalWindows;
