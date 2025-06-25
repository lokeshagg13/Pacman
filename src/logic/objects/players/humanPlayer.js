import Player from "./player";

class HumanPlayer extends Player {
    constructor({ position, indices, velocity, radius }) {
        super({ position, indices, velocity, radius });
    }
}

export default HumanPlayer;