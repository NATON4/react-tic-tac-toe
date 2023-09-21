import React from 'react';

interface CellProps {
    value: string | null;
    onSquareClick: () => void;
}

enum Players {
    firstPlayer = 'X',
    secondPlayer = 'O',
}

const Cell: React.FC<CellProps> = ({value, onSquareClick}) => {
    let cellClass = "cell";

    if (value === Players.secondPlayer) {
        cellClass += " cell-zero";
    } else if (value === Players.firstPlayer) {
        cellClass += " cell-dagger";
    }

    return (
        <button className={cellClass} onClick={onSquareClick}>
            <svg width="100%" height="100%" viewBox="0 0 90 90">
                <text className="cell-text" x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize="400%" fill="white">{value}</text>
            </svg>
        </button>
    );
};

export default Cell;
