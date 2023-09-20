import React, {useState} from 'react';
import Cell from './Cell';
import ModalWindows from './ModalWindow';

enum Player {
    X = 'X',
    O = 'O',
}

interface BoardProps {
    boardSize: number;
    winningSize: number;
}

interface GameState {
    squares: string[] | null[];
    winner: string | null;
    nextValue: boolean;
}

const Board: React.FC<BoardProps> = ({boardSize, winningSize}) => {
    const initialSquares = loadGameState(boardSize * boardSize);
    const [modalShown, setModalShown] = useState(false);
    const [restartConfirmed, setRestartConfirmed] = useState(false);
    const [squares, setSquares] = useState<string[] | null[]>(
            (initialSquares && initialSquares.squares) || Array(boardSize * boardSize).fill(null));
    const [nextValue, setNextValue] = useState<boolean>(
        (initialSquares && initialSquares.nextValue) || false // Може бути баг з початковим значенням
    );

    function saveGameState(squares: (string | null)[], nextValue: boolean) {
        const gameState = { squares, nextValue };
        localStorage.setItem('ticTacToeGame', JSON.stringify(gameState));
    }

    function loadGameState(numSquares: number) {
        const savedGameState = localStorage.getItem('ticTacToeGame');

        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);

            if (gameState.squares.length === numSquares) {
                return { squares: gameState.squares, nextValue: gameState.nextValue };
            }
        }

        return null;
    }

    function handleReset() {
        if (restartConfirmed) {
            setSquares(Array(boardSize * boardSize).fill(null));
            saveGameState(Array(boardSize * boardSize).fill(null), nextValue);
        } else {
            const confirmRestart = window.confirm('Ви впевнені, що хочете почати нову гру? Це скине поточний прогрес.');

            if (!confirmRestart) return;

            setSquares(Array(boardSize * boardSize).fill(null));
            saveGameState(Array(boardSize * boardSize).fill(null), nextValue);
        }

        setRestartConfirmed(false);
    }

    function closeModal() {
        setModalShown(false);
        setSquares(Array(boardSize * boardSize).fill(null));
        saveGameState(Array(boardSize * boardSize).fill(null), nextValue);
    }

    function handleClick(index: number) {
        const isCellDirty = squares[index];
        if (isCellDirty) return;

        const nextSquares = squares.slice();
        const updatedNextValue = !nextValue;

        if (updatedNextValue) {
            nextSquares[index] = Player.X;
        } else {
            nextSquares[index] = Player.O;
        }

        setSquares(nextSquares);
        setNextValue(updatedNextValue);

        const winner = calculateWinner(nextSquares, boardSize, winningSize);
        saveGameState(nextSquares, updatedNextValue);

        if (winner) {
            setTimeout(() => setModalShown(true), 50);
        }
    }

    function calculateWinner(squares: (string | null)[], boardSize: number, winningSize: number) {
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

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const [a, b, c, ...rest] = line;

            if (
                squares[a]
                && squares[a] === squares[b] &&
                squares[a] === squares[c] &&
                rest.every((index) => squares[index] === squares[a])
            ) {
                return squares[a];
            }
        }

        return null;
    }

    const winner = calculateWinner(squares, boardSize, winningSize);

    if (winner) {
        setTimeout(() => {
            setModalShown(true);
            saveGameState(squares, nextValue);
        }, 50);
    }

    return (
        <div className="game-desk">
            <button className="reset-button" onClick={handleReset}>Reset</button>
            <div
                className="board"
                style={{
                    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                    gridTemplateRows: `repeat(${boardSize}, 1fr)`,
                }}
            >
                {squares.map((value, index) => (
                    <Cell
                        key={index}
                        value={value}
                        onSquareClick={() => handleClick(index)}
                    />
                ))}
            </div>
            {modalShown && <ModalWindows winner={winner} onClose={() => closeModal()}/>} {}
        </div>
    );
};

export default Board;