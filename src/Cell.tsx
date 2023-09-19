import React from 'react';

interface CellProps {
    value: string | null;
    onSquareClick: () => void;
}

enum Player {
    X = 'X',
    O = 'O',
}

const Cell: React.FC<CellProps> = ({value, onSquareClick}) => {
    let cellClass = "cell";

    if (value === Player.O) {
        cellClass += " cell-zero";
    } else if (value === Player.X) {
        cellClass += " cell-dagger";
    }

    return (
        <button className={cellClass} onClick={onSquareClick}>
            {value}
        </button>
    );
};

export default Cell;
