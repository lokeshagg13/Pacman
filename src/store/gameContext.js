import { createContext, useRef, useState } from "react";

const GameContext = createContext({
    gameStatus: null,
    score: 0,
    lives: 3,
    gameCanvasRef: null,
    incrementScore: () => { },
    decrementLives: () => { }
});

export function GameContextProvider(props) {
    // const [gameStatus, setGameStatus] = useState(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    const gameCanvasRef = useRef(null);

    function incrementScore() {
        setScore((prevScore) => prevScore + 1);
    }

    function decrementLives() {
        setLives((prevLives) => prevLives - 1);
        if (lives === 0) return false;
        return true;
    }

    const currentGameContext = {
        // gameStatus,
        score,
        lives,
        gameCanvasRef,
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