import React from 'react';

interface CellProps {
    value: string | null;
    onSquareClick: () => void;
}

const Cell: React.FC<CellProps> = ({value, onSquareClick}) => {
    let cellClass = "cell";

    if (value === "O") {
        cellClass += " cell-zero";
    } else if (value === "X") {
        cellClass += " cell-dagger";
    }

    return (
        <button className={cellClass} onClick={onSquareClick}>
            {value}
        </button>
    );
};

export default Cell;
