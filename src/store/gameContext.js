import { createContext, useRef, useState } from "react";

const GameContext = createContext({
    gameStatus: null,
    score: 0,
    gameCanvasRef: null,
    incrementScore: () => { },
});

export function GameContextProvider(props) {
    // const [gameStatus, setGameStatus] = useState(null);
    const [score, setScore] = useState(0);

    const gameCanvasRef = useRef(null);

    function incrementScore() {
        setScore((prevScore) => prevScore + 1);
    }

    const currentGameContext = {
        // gameStatus,
        score,
        gameCanvasRef,
        incrementScore
    };

    return (
        <GameContext.Provider value={currentGameContext}>
            {props.children}
        </GameContext.Provider>
    );
}

export default GameContext;