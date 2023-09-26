import React, {useState, useEffect} from 'react';
import Cell from './Cell';

enum Players {
    firstPlayer = 'X',
    secondPlayer = 'O',
}

type BoardProps = {
    boardSize: number;
    winningSize: number;
    onGameEnd: (winner: string | null) => void;
}

type GameState = {
    squares: string[] | null[];
    nextValue: boolean;
}

type GameInfo = {
    squares: (string | null)[];
    nextValue: boolean;
}

let serverPollingBoard: NodeJS.Timer | null = null;

const Board: React.FC<BoardProps> = ({boardSize, winningSize, onGameEnd}) => {
    console.log("Reloaded board");
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

    const backendUrl = "http://192.168.10.10:4000"

    function sendWinnerData() {
        const gameWinner = localStorage.getItem('winner');
        const modalIsShown = localStorage.getItem('modalShown');

        const winnerData = {
            winner: gameWinner,
            modalShown: modalIsShown,
        };

        fetch(`${backendUrl}/update-winner-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(winnerData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((updatedData) => {
                console.log('Updated Data:', updatedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function sendGameState(gameState: GameInfo) {
        fetch(`${backendUrl}/update-game-state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({gameState}),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((updatedData) => {
                console.log('Updated Data:', updatedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function showGameSizeData() {
        fetch(`${backendUrl}/game-size`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Game Size Data:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function showGameState() {
        fetch(`${backendUrl}/game-state`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Game State Data:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function showWinnerData() {
        console.log("winner data");
        fetch(`${backendUrl}/winner-info`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Winner Data:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateDataInAllTabs(gameState: GameState | null) {
        if (gameState) {
            setSquares(gameState.squares);
            setNextValue(gameState.nextValue);
        }
    }

    function saveGameState(squares: (string | null)[], nextValue: boolean) {
        const gameState = {squares, nextValue};
        localStorage.setItem('ticTacToeGame', JSON.stringify(gameState));
        sendGameState(gameState);
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

    function updateCells() {
        fetch(`${backendUrl}/game-state`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.squares !== squares) {
                    console.log("Effect of squares change");
                    setSquares(data.squares);
                    setNextValue(data.nextValue);
                }
                else {
                    console.log("Nothing");
                }

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (!serverPollingBoard) {
            setInterval(updateCells, 500);
            console.log("pollingOnlyOnce");
        }
    }, []);

    useEffect(() => {
        console.log("Effect of cells");
        setSquares(Array(boardSize * boardSize).fill(null));
        saveGameState(Array(boardSize * boardSize).fill(null), false);
        setNextValue(false);
    }, [boardSize]);

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

        const winner = calculateWinner(nextSquares, boardSize, winningSize);
        saveGameState(nextSquares, updatedNextValue);

        if (winner) {
            onGameEnd(winner);
            sendWinnerData();
            setSquares(Array(boardSize * boardSize).fill(null));
            saveGameState(Array(boardSize * boardSize).fill(null), false);
        }

        setSquares(nextSquares);
        setNextValue(!nextValue);
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
            <div className="control-buttons">
                <button className="reset-button" onClick={handleReset}>
                    Reset
                </button>
                <button className="reset-button" onClick={showGameSizeData}>
                    Get GI
                </button>
                <button className="reset-button" onClick={showWinnerData}>
                    Get WI
                </button>
                <button className="reset-button" onClick={showGameState}>
                    Get GS
                </button>
            </div>
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
