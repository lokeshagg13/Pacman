import { createContext, useRef, useState } from "react";
import { initGame } from "../logic/gameLoop";
import constants from "./constants";

const GameContext = createContext({
    gameStatus: null,
    playerType: null,
    difficultyLevel: null,
    score: 0,
    lives: 3,
    isWinner: false,
    gameCanvasRef: null,
    incrementScore: () => { },
    decrementLives: () => { },
    handleStartGame: (playerType, difficultyLevel) => { },
    handlePauseGame: () => { },
    handleResumeGame: () => { },
    handleInterruptGame: () => { },
    handleEndGame: (isWinner) => { },
});

export function GameContextProvider(props) {
    const [gameStatus, setGameStatus] = useState(null);
    const [playerType, setPlayerType] = useState(constants.PLAYER.TYPES[0]);
    const [difficultyLevel, setDifficultyLevel] = useState(
        constants.GAME.DIFFICULTY_TYPES[0].LEVEL
    );
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(constants.PLAYER.TOTAL_LIVES);
    const [isWinner, setIsWinner] = useState(false);

    const gameCanvasRef = useRef(null);
    const pauseGameFuncRef = useRef(null);
    const resumeGameFuncRef = useRef(null);
    const endGameFuncRef = useRef(null);

    function handleStartGame(playerType, difficultyLevel) {
        setGameStatus("running");
        setScore(0);
        setLives(constants.PLAYER.TOTAL_LIVES);
        if (playerType && constants.PLAYER.TYPES.includes(playerType)) setPlayerType(playerType);

        const levels = constants.GAME.DIFFICULTY_TYPES.map(level => level.LEVEL);
        if (difficultyLevel && levels.includes(difficultyLevel)) setDifficultyLevel(difficultyLevel);

        const { startGame, pauseGame, resumeGame, endGame } = initGame(gameCanvasRef.current, playerType, difficultyLevel, {
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
        difficultyLevel,
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