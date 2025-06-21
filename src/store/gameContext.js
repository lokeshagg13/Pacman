import { createContext, useRef, useState } from "react";
import { initGame } from "../logic/gameLoop";
import constants from "./constants";

const GameContext = createContext({
    gameStatus: null,
    playerType: null,
    score: 0,
    lives: 3,
    isWinner: false,
    gameCanvasRef: null,
    incrementScore: () => { },
    decrementLives: () => { },
    handleStartGame: (playerType) => { },
    handlePauseGame: () => { },
    handleResumeGame: () => { },
    handleInterruptGame: () => { },
    handleEndGame: (isWinner) => { },
});

export function GameContextProvider(props) {
    const [gameStatus, setGameStatus] = useState(null);
    const [playerType, setPlayerType] = useState(constants.PLAYER_TYPES[0]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(constants.TOTAL_LIVES);
    const [isWinner, setIsWinner] = useState(false);

    const gameCanvasRef = useRef(null);
    const pauseGameFuncRef = useRef(null);
    const resumeGameFuncRef = useRef(null);
    const endGameFuncRef = useRef(null);

    function handleStartGame(playerType) {
        setGameStatus("running");
        setScore(0);
        setLives(constants.TOTAL_LIVES);
        if (playerType && constants.PLAYER_TYPES.includes(playerType)) setPlayerType(playerType);
        
        const { startGame, pauseGame, resumeGame, endGame } = initGame(gameCanvasRef.current, playerType, {
            incrementScore,
            decrementLives,
        });
        pauseGameFuncRef.current = pauseGame;
        resumeGameFuncRef.current = resumeGame;
        endGameFuncRef.current = endGame;
        startGame();
    }

    function handlePauseGame() {
        setGameStatus("paused");
        if (pauseGameFuncRef.current) {
            pauseGameFuncRef.current();
        }
    }

    function handleResumeGame() {
        setGameStatus("running");
        if (resumeGameFuncRef.current) {
            resumeGameFuncRef.current();
        }
    }

    function handleInterruptGame() {
        if (endGameFuncRef.current) {
            endGameFuncRef.current();
            endGameFuncRef.current = null;
        }
        setGameStatus(null);
    }

    function handleEndGame(isWinner) {
        if (endGameFuncRef.current) {
            endGameFuncRef.current();
            endGameFuncRef.current = null;
        }
        setGameStatus("completed");
        setIsWinner(isWinner);
    }

    function incrementScore() {
        setScore((prevScore) => prevScore + 1);
    }

    function decrementLives() {
        setLives((prevLives) => prevLives - 1);
    }

    const currentGameContext = {
        gameStatus,
        playerType,
        score,
        lives,
        isWinner,
        gameCanvasRef,
        handleStartGame,
        handlePauseGame,
        handleResumeGame,
        handleInterruptGame,
        handleEndGame,
        incrementScore,
        decrementLives
    };

    return (
        <GameContext.Provider value={currentGameContext}>
            {props.children}
        </GameContext.Provider>
    );
}

export default GameContext;