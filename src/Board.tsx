import React, {useState, useEffect} from 'react';
import Cell from './Cell';

enum Players {
    firstPlayer = 'X',
    secondPlayer = 'O',
}

interface BoardProps {
    boardSize: number;
    winningSize: number;
    onGameEnd: (winner: string | null) => void;
}

interface GameState {
    squares: string[] | null[];
    nextValue: boolean;
}

const Board: React.FC<BoardProps> = ({boardSize, winningSize, onGameEnd}) => {
    const initialSquares = loadGameState(boardSize * boardSize);
    const [squares, setSquares] = useState<string[] | null[]>(
        (initialSquares && initialSquares.squares) || Array(boardSize * boardSize).fill(null)
    );
    const [nextValue, setNextValue] = useState<boolean>(
        (initialSquares && initialSquares.nextValue) || false
    );

    window.addEventListener('storage', function (e) {
        if (e.key === 'ticTacToeGame') {
            const gameState = JSON.parse(e.newValue || 'null');
            updateDataInAllTabs(gameState);
        }
    });

    function updateDataInAllTabs(gameState: GameState | null) {
        if (gameState) {
            setSquares(gameState.squares);
            setNextValue(gameState.nextValue);
        }
    }

    function saveGameState(squares: (string | null)[], nextValue: boolean) {
        const gameState = {squares, nextValue};
        localStorage.setItem('ticTacToeGame', JSON.stringify(gameState));
    }

    function loadGameState(numSquares: number) {
        const savedGameState = localStorage.getItem('ticTacToeGame');

        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);

            if (gameState.squares.length === numSquares) {
                return {squares: gameState.squares, nextValue: gameState.nextValue};
            }
        }

        return null;
    }

    function handleReset() {
        const confirmRestart = window.confirm('Ви впевнені, що хочете почати нову гру? Це скине поточний прогрес.');

        if (!confirmRestart) return;

        setSquares(Array(boardSize * boardSize).fill(null));
        saveGameState(Array(boardSize * boardSize).fill(null), false);
        setNextValue(false);
    }

    function handleClick(index: number) {
        const isCellDirty = squares[index];
        if (isCellDirty) return;

        const nextSquares = squares.slice();
        const updatedNextValue = !nextValue;

        if (updatedNextValue) {
            nextSquares[index] = Players.firstPlayer;
        } else {
            nextSquares[index] = Players.secondPlayer;
        }

        setSquares(nextSquares);
        setNextValue(updatedNextValue);

        const winner = calculateWinner(nextSquares, boardSize, winningSize);
        saveGameState(nextSquares, updatedNextValue);

        if (winner) {
            onGameEnd(winner);
            setSquares(Array(boardSize * boardSize).fill(null));
            saveGameState(Array(boardSize * boardSize).fill(null), false);
        }
    }

    function calculateWinner(squares: (string | null)[], boardSize: number, winningSize: number) {
        const lines = getAllWinningLines(boardSize, winningSize);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const [a, b, c, ...rest] = line;

            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c] &&
                rest.every((index) => squares[index] === squares[a])
            ) {
                return squares[a];
            }
        }

        return null;
    }

    function getAllWinningLines(boardSize: number, winningSize: number) {
        const lines: number[][] = [];

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j <= boardSize - winningSize; j++) {
                const row: number[] = [];

                for (let k = 0; k < winningSize; k++) {
                    row.push(i * boardSize + j + k);
                }

                lines.push(row);
            }
        }

        for (let i = 0; i <= boardSize - winningSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const col: number[] = [];

                for (let k = 0; k < winningSize; k++) {
                    col.push((i + k) * boardSize + j);
                }

                lines.push(col);
            }
        }

        for (let i = 0; i <= boardSize - winningSize; i++) {
            for (let j = 0; j <= boardSize - winningSize; j++) {
                const diagonal1: number[] = [];
                const diagonal2: number[] = [];

                for (let k = 0; k < winningSize; k++) {
                    diagonal1.push((i + k) * boardSize + j + k);
                    diagonal2.push((i + k) * boardSize + j + winningSize - 1 - k);
                }

                lines.push(diagonal1, diagonal2);
            }
        }

        return lines;
    }

    return (
        <div className="game-desk">
            <button className="reset-button" onClick={handleReset}>
                Reset
            </button>
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
