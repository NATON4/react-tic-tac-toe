import React, {useState, useEffect} from 'react';
import Board, {Players} from "./Board";
import ModalWindow from "./ModalWindow";
import './App.css';

let serverPolling: NodeJS.Timer | null = null;
let newServerPolling: NodeJS.Timer | null = null;

function App() {
    //const [boardSizeFromBack, setBoardSizeFromBack] = useState(3);
    //const [charsToWinFromBack, setCharsToWinFromBack] = useState(3);

    //const [tempBoardSize, setTempBoardSize] = useState(boardSizeFromBack || 3);
    const [boardSize, setBoardSize] = useState(3);
    //const [tempWinningSize, setTempWinningSize] = useState(charsToWinFromBack || 3);
    const [charsToWin, setCharsToWin] = useState(3);
    //const [winner, setWinner] = useState<string | null>(null);
    //const [isModalVisible, setIsModalVisible] = useState(false);

    let winner: Players | null | string = null;
    let isModalVisible: boolean = false;

    useEffect(() => {
        const savedBoardSize = localStorage.getItem('boardSize');
        const savedWinningSize = localStorage.getItem('winningSize');
        const savedWinner = localStorage.getItem('winner');
        const savedModalShown = localStorage.getItem('modalShown');

        if (savedBoardSize) {
            setBoardSize(parseInt(savedBoardSize));
            //setTempBoardSize(parseInt(savedBoardSize));
        }

        if (savedWinningSize) {
            setCharsToWin(parseInt(savedWinningSize));
            //setTempWinningSize(parseInt(savedWinningSize));
        }

        if (savedWinner) {
            winner = savedWinner;
            //setWinner(savedWinner);
        }

        if (savedModalShown) {
            isModalVisible = true;
            //setIsModalVisible(savedModalShown === 'true');
        }

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const backendUrl = "http://192.168.10.10:4000";

    function checkGameSize() {
        fetch(`${backendUrl}/game-size`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                let frontSizeToWin = charsToWin.toString();
                let frontBoardSize = boardSize.toString();
                console.log(data.boardSize, frontBoardSize);
                if (data.boardSize !== frontBoardSize || data.winningSize !== frontSizeToWin) {
                    localStorage.setItem('boardSize', data.boardSize.toString());
                    localStorage.setItem('winningSize', data.sizeToWin.toString());

                    //setTempBoardSize(data.boardSize);
                    //setTempWinningSize(data.sizeToWin);

                    setBoardSize(data.boardSize);
                    setCharsToWin(data.sizeToWin);

                } else {
                    alert("nothing");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (!serverPolling) {
            serverPolling = setInterval(checkGameSize, 500);
        }

        return () => serverPolling ? clearInterval(serverPolling) : void 0;
    }, [boardSize, checkGameSize, charsToWin]);

    function reloadWinner() {
        fetch(`${backendUrl}/winner-info`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                let doesModalShown = data.modalShown.toString();
                if (data.winner !== winner || data.winner === "") {
                    localStorage.setItem('winner', data.winner.toString());
                    localStorage.setItem('modalShown', doesModalShown);

                    winner = data.winner;
                    //setWinner(data.winner);
                    isModalVisible = data.modalShown;
                    //setIsModalVisible(data.modalShown);
                }

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (!newServerPolling) {
            newServerPolling = setInterval(reloadWinner, 500);
        }
    }, [winner, isModalVisible, reloadWinner]);

    function sendBoardSizeData() {
        const savedBoardSize = localStorage.getItem('boardSize');
        const savedWinningSize = localStorage.getItem('winningSize');

        const gameSizeData = {
            sizeToWin: savedWinningSize,
            boardSize: savedBoardSize,
        };

        fetch(`${backendUrl}/update-size-data`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(gameSizeData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((updatedData) => {
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleSetBoardSize = () => {
        if (boardSize < 3) {
            setBoardSize(3);
        } else if (boardSize > 20) {
            setBoardSize(20);
        } else {
            setBoardSize(boardSize);
        }

        localStorage.setItem('boardSize', boardSize.toString());

        sendBoardSizeData();
    };

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'boardSize') {
            setBoardSize(parseInt(e.newValue || '3'));
            //setTempBoardSize(parseInt(e.newValue || '3'));
            checkGameSize();
        } else if (e.key === 'winningSize') {
            setCharsToWin(parseInt(e.newValue || '3'));
            //setTempWinningSize(parseInt(e.newValue || '3'));
            checkGameSize();
        } else if (e.key === 'winner') {
            winner = e.newValue;
            //setWinner(e.newValue);
        } else if (e.key === 'modalShown') {
            //setIsModalVisible(e.newValue === 'true');
            isModalVisible = true;
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
            .then((updatedData) => {
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleSetWinningSize = () => {
        if (charsToWin < 3) {
            setCharsToWin(3);
        } else if (charsToWin > 20) {
            setCharsToWin(20);
        } else {
            setCharsToWin(charsToWin);
        }
        localStorage.setItem('winningSize', charsToWin.toString());

        sendBoardSizeData();
    };

    const handleCloseModal = () => {
        //setIsModalVisible(false);
        isModalVisible = false;
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
                        value={boardSize}
                        min="3"
                        max="20"
                        onChange={(e) => {
                            setBoardSize(parseInt(e.target.value));
                        }}
                    />
                    <button className="board-size-button" onClick={handleSetBoardSize}>Set Board Size</button>
                </div>
                <div>
                    <input
                        id="winningSize"
                        className="board-size-input"
                        type="number"
                        value={charsToWin}
                        min="3"
                        max={boardSize}
                        onChange={(e) => {
                            setCharsToWin(parseInt(e.target.value))
                        }}
                    />
                    <button className="board-size-button" onClick={handleSetWinningSize}>Set Winning Size</button>

                </div>
            </div>
            <Board
                key={boardSize}
                boardSize={boardSize}
                winningSize={charsToWin}
                onGameEnd={(winner) => {
                    //setWinner(winner);
                    winner = winner;
                    isModalVisible = true;
                    //setIsModalVisible(true);
                    if (winner) {
                        localStorage.setItem('winner', winner);
                        localStorage.setItem('modalShown', 'true');
                    } else {
                        localStorage.removeItem('winner');
                        localStorage.setItem('modalShown', 'false');
                    }
                }}
            />
            {isModalVisible && (<ModalWindow winner={winner} onClose={handleCloseModal}/>)}
        </div>
    );
}

export default App;
