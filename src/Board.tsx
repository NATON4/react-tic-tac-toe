import React, {useState} from 'react';
import Cell from './Cell';

const Board = () => {
    const [nextValue, setNextValue] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [result, setResult] = useState<string | null>("?");

    function handleReset() {
        setSquares(Array(9).fill(null));
    }

    function handleClick(index: number) {
        const isCellDirty = squares[index];
        if (isCellDirty) {
            return;
        }

        const nextSquares = squares.slice();

        if (nextValue) {
            nextSquares[index] = 'X';
        } else {
            nextSquares[index] = 'O';
        }

        setSquares(nextSquares);
        setNextValue(!nextValue);
    }

    const winner = calculateWinner(squares, 3);

    if (winner) {
        setTimeout(() => {
            setResult(winner);
        }, 50);
        setTimeout(() => {
            handleReset();
        }, 1000);

    } else {
        console.log("Next player: " + (nextValue ? "X" : "O"));
    }

    function calculateWinner(squares: (string | null)[], size: number) {
        const lines: number[][] = [];

        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            const row: number[] = [];
            const col: number[] = [];

            for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                row.push(rowIndex * size + columnIndex);
                col.push(columnIndex * size + rowIndex);
            }

            lines.push(row, col);
        }

        const diagonal1: number[] = [];
        const diagonal2: number[] = [];

        for (let index = 0; index < size; index++) {
            diagonal1.push(index * size + index);
            diagonal2.push(index * size + (size - 1 - index));
        }

        lines.push(diagonal1, diagonal2);

        for (let index = 0; index < lines.length; index++) {
            const [a, b, c] = lines[index];

            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }

        return null;
    }

    return (
        <div>
            <div className="winner-info">
                <h3 className="winner-info__text">Winner: </h3>
                <h3 className="winner-info__result-info">{result}</h3>
            </div>
            <button className="reset-button" onClick={handleReset}>Reset</button>
            <br/> <br/>
            <div className="board">
                <Cell value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Cell value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Cell value={squares[2]} onSquareClick={() => handleClick(2)}/>
                <Cell value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Cell value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Cell value={squares[5]} onSquareClick={() => handleClick(5)}/>
                <Cell value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Cell value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Cell value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
        </div>
    );
};

export default Board;
