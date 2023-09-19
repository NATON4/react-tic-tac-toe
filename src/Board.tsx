import React, {useState} from 'react';
import Cell from './Cell';

enum Player {
    X = 'X',
    O = 'O',
}

interface BoardProps {
    boardSize: number;
    winningSize: number;
}

const Board: React.FC<BoardProps> = ({boardSize, winningSize}) => {
    const [nextValue, setNextValue] = useState(true);
    const [squares, setSquares] = useState(Array(boardSize * boardSize).fill(null));
    const [result, setResult] = useState<string | null>("?");

    function handleReset() {
        setSquares(Array(boardSize * boardSize).fill(null));
        setResult("?");
    }

    function handleClick(index: number) {
        const isCellDirty = squares[index];

        if (isCellDirty) {
            return;
        }

        const nextSquares = squares.slice();

        if (nextValue) {
            nextSquares[index] = Player.X;
        } else {
            nextSquares[index] = Player.O;
        }

        setSquares(nextSquares);
        setNextValue(!nextValue);
    }

    function calculateWinner(squares: (string | null)[], boardSize: number, winningSize: number) {
        const lines: number[][] = [];

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col <= boardSize - winningSize; col++) {
                const horizontalLine: number[] = [];

                for (let offset = 0; offset < winningSize; offset++) {
                    horizontalLine.push(row * boardSize + col + offset);
                }

                lines.push(horizontalLine);
            }
        }

        for (let col = 0; col <= boardSize - winningSize; col++) {
            for (let row = 0; row < boardSize; row++) {
                const verticalLine: number[] = [];

                for (let offset = 0; offset < winningSize; offset++) {
                    verticalLine.push((row + offset) * boardSize + col);
                }

                lines.push(verticalLine);
            }
        }

        for (let row = 0; row <= boardSize - winningSize; row++) {
            for (let col = 0; col <= boardSize - winningSize; col++) {
                const mainDiagonal: number[] = [];
                const counterDiagonal: number[] = [];

                for (let offset = 0; offset < winningSize; offset++) {
                    mainDiagonal.push((row + offset) * boardSize + col + offset);
                    counterDiagonal.push((row + offset) * boardSize + col + winningSize - 1 - offset);
                }

                lines.push(mainDiagonal, counterDiagonal);
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const [start, ...rest] = line;

            const isWinningLine = squares[start] &&
                rest.every((index) => squares[index] === squares[start]);

            if (isWinningLine) {
                return squares[start];
            }
        }

        return null;
    }

    const winner = calculateWinner(squares, boardSize, winningSize);

    if (winner) {
        setTimeout(() => {
            setResult(winner);
        }, 50);
        setTimeout(() => {
            handleReset();
        }, 1000);
    }

    return (
        <div>
            <div className="winner-info">
                <h3 className="winner-info__text">Winner: </h3>
                <h3 className="winner-info__result-info">{result}</h3>
            </div>
            <button className="reset-button" onClick={handleReset}>Reset</button>
            <br/> <br/>
            <div
                className="board"
                style={{
                    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                    gridTemplateRows: `repeat(${boardSize}, 1fr)`,
                }}
            >
                {squares.map((value, index) => (
                    <Cell key={index} value={value} onSquareClick={() => handleClick(index)}/>
                ))}
            </div>
        </div>
    );
};

export default Board;
