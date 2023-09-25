import React, { useState, useEffect } from 'react';
import Board from "./Board";
import ModalWindow from "./ModalWindow";
import './App.css';

let serverPolling: NodeJS.Timer | null = null;

function App() {
    const [tempBoardSize, setTempBoardSize] = useState(3);
    const [boardSize, setBoardSize] = useState(3);
    const [tempWinningSize, setTempWinningSize] = useState(3);
    const [winningSize, setWinningSize] = useState(3);
    const [winner, setWinner] = useState<string | null>(null);
    const [modalShown, setModalShown] = useState(false);

    useEffect(() => {
        const savedBoardSize = localStorage.getItem('boardSize');
        const savedWinningSize = localStorage.getItem('winningSize');
        const savedWinner = localStorage.getItem('winner');
        const savedModalShown = localStorage.getItem('modalShown');

        if (savedBoardSize) {
            setBoardSize(parseInt(savedBoardSize));
            setTempBoardSize(parseInt(savedBoardSize));
        }

        if (savedWinningSize) {
            setWinningSize(parseInt(savedWinningSize));
            setTempWinningSize(parseInt(savedWinningSize));
        }

        if (savedWinner) { setWinner(savedWinner); }

        if (savedModalShown) { setModalShown(savedModalShown === 'true'); }

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const backendUrl = "http://192.168.10.10:4000";

    function reloadSizeData() {
        fetch(`${backendUrl}/game-size`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('winningSize', data.sizeToWin.toString());
                localStorage.setItem('boardSize', data.boardSize.toString());
                setTempBoardSize(data.boardSize);
                setTempWinningSize(data.sizeToWin);
                setBoardSize(data.boardSize);
                setWinningSize(data.sizeToWin);
                /*const test = localStorage.getItem('boardSize');
                console.log(test);*/
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function reloadWinningData() {
        fetch(`${backendUrl}/winner-info`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('winner', data.winner.toString());
                localStorage.setItem('modalShown', data.modalShown.toString());
                /*setTempBoardSize(data.boardSize);
                setTempWinningSize(data.sizeToWin.toString());*/
                setWinner(data.winner);
                setModalShown(data.modalShown);
                /*const test = localStorage.getItem('boardSize');
                console.log(test);*/
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (!serverPolling) {
            setInterval(reloadSizeData, 1000);
            setInterval(reloadWinningData, 300);
        }

    }, []);

    function sendBoardSizeData() {
        const savedBoardSize = localStorage.getItem('boardSize');
        const savedWinningSize = localStorage.getItem('winningSize');

        const gameSizeData = {
            sizeToWin: savedWinningSize,
            boardSize: savedBoardSize,
        };

        fetch(`${backendUrl}/update-size-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(gameSizeData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((updatedData) => { console.log('Updated Data:', updatedData); })
            .catch((error) => { console.error('Error:', error); });
    }

    const handleSetBoardSize = () => {
        if (tempBoardSize < 3) {
            setBoardSize(3);
        } else if (tempBoardSize > 20) {
            setBoardSize(20);
        } else {
            setBoardSize(tempBoardSize);
        }
        localStorage.setItem('boardSize', tempBoardSize.toString());

        sendBoardSizeData();
    };

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'boardSize') {
            setBoardSize(parseInt(e.newValue || '3'));
            setTempBoardSize(parseInt(e.newValue || '3'));
        } else if (e.key === 'winningSize') {
            setWinningSize(parseInt(e.newValue || '3'));
            setTempWinningSize(parseInt(e.newValue || '3'));
        } else if (e.key === 'winner') {
            setWinner(e.newValue);
        } else if (e.key === 'modalShown') {
            setModalShown(e.newValue === 'true');
        }
    };

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
            .then((updatedData) => { console.log('Updated Data:', updatedData); })
            .catch((error) => { console.error('Error:', error); });
    }

    const handleSetWinningSize = () => {
        if (tempWinningSize < 3) {
            setWinningSize(3);
        } else if (tempWinningSize > 20) {
            setWinningSize(20);
        } else {
            setWinningSize(tempWinningSize);
        }
        localStorage.setItem('winningSize', tempWinningSize.toString());

        sendBoardSizeData();
    };

    const handleCloseModal = () => {
        setModalShown(false);
        localStorage.removeItem('winner');
        localStorage.setItem('modalShown', 'false');
        sendWinnerData();
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
            <Board
                key={boardSize * winningSize * tempWinningSize * tempBoardSize}
                boardSize={boardSize}
                winningSize={winningSize}
                onGameEnd={(winner) => {
                    setWinner(winner);
                    setModalShown(true);
                    if (winner) {
                        localStorage.setItem('winner', winner);
                        localStorage.setItem('modalShown', 'true');
                    } else {
                        localStorage.removeItem('winner');
                        localStorage.setItem('modalShown', 'false');
                    }
                }}
            />
            {modalShown && (<ModalWindow winner={winner} onClose={handleCloseModal}/>)}
        </div>
    );
}

export default App;
