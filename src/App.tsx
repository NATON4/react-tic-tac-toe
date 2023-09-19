import React, {useState} from 'react';
import Board from "./Board";
import './App.css';

function App() {
    const [tempBoardSize, setTempBoardSize] = useState(3);
    const [boardSize, setBoardSize] = useState(3);
    const [tempWinningSize, setTempWinningSize] = useState(3);
    const [winningSize, setWinningSize] = useState(3);

    const handleSetBoardSize = () => {
        if (tempBoardSize < 3) {
            setBoardSize(3);
        } else if (tempBoardSize > 20) {
            setBoardSize(20);
        } else {
            setBoardSize(tempBoardSize);
        }
    };

    const handleSetWinningSize = () => {
        if (tempWinningSize < 3) {
            setWinningSize(3);
        } else if (tempWinningSize > 20) {
            setWinningSize(20);
        } else {
            setWinningSize(tempWinningSize);
        }
    };

    return (
        <div className="App">
            <h1>Tic-Tac-Toe</h1>
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
            <Board key={boardSize * winningSize} boardSize={boardSize} winningSize={winningSize}/>
        </div>
    );
}

export default App;
