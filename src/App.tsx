import React, { useState, useEffect } from 'react';
import Board from "./Board";
import './App.css';

function App() {
    const [tempBoardSize, setTempBoardSize] = useState(3);
    const [boardSize, setBoardSize] = useState(3);
    const [tempWinningSize, setTempWinningSize] = useState(3);
    const [winningSize, setWinningSize] = useState(3);

    useEffect(() => {
        const savedBoardSize = localStorage.getItem('boardSize');
        const savedWinningSize = localStorage.getItem('winningSize');

        if (savedBoardSize) {
            setBoardSize(parseInt(savedBoardSize));
            setTempBoardSize(parseInt(savedBoardSize));
        }

        if (savedWinningSize) {
            setWinningSize(parseInt(savedWinningSize));
            setTempWinningSize(parseInt(savedWinningSize));
        }
    }, []);

    const handleSetBoardSize = () => {
        if (tempBoardSize < 3) {
            setBoardSize(3);
        } else if (tempBoardSize > 20) {
            setBoardSize(20);
        } else {
            setBoardSize(tempBoardSize);
        }
        localStorage.setItem('boardSize', tempBoardSize.toString());
    };

    const handleSetWinningSize = () => {
        if (tempWinningSize < 3) {
            setWinningSize(3);
        } else if (tempWinningSize > 20) {
            setWinningSize(20);
        } else {
            setWinningSize(tempWinningSize);
        }
        localStorage.setItem('winningSize', tempWinningSize.toString());
    };

    return (
        <div className="App">
            <h1>Tic-Tac-Toe</h1>
            <div className="game-info">
            <div>
                <input
                    id="boardSize"
                    className="board-size-input"
                    type="number"
                    value={tempBoardSize}
                    min="3"
                    max="20"
                    onChange={(e) => setTempBoardSize(parseInt(e.target.value))}
                />
                <button className="board-size-button" onClick={handleSetBoardSize}>Set Board Size</button>
            </div>
            <div>
                <input
                    id="winningSize"
                    className="board-size-input"
                    type="number"
                    value={tempWinningSize}
                    min="3"
                    max={boardSize}
                    onChange={(e) => setTempWinningSize(parseInt(e.target.value))}
                />
                <button className="board-size-button" onClick={handleSetWinningSize}>Set Winning Size</button>
            </div>
            </div>
            <Board key={boardSize * winningSize} boardSize={boardSize} winningSize={winningSize}/>
        </div>
    );
}

export default App;
