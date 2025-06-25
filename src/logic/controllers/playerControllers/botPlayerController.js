import PathFinder from "../../bot/pathFinder";
import PlayerController from "./playerController";

class BotPlayerController extends PlayerController {
    constructor(game) {
        super(game);

        this.movableGrid = null;
        this.pathFinder = new PathFinder()
        this.autoState = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.lastActionValue = "";
    }

    // Reset auto states
    resetAutoStates() {
        for (let dir in this.autoState) {
            if (this.autoState.hasOwnProperty(dir)) {
                this.autoState[dir] = false;
            }
        }
    }

    // Update player's movement state based on automatic states
    updatePlayerMovement() {
        const direction = this.lastActionValue;
        if (
            direction && this.autoState[this.lastActionValue] && this.isOverallPlayerMovementValid(direction)
        ) {
            this.game.player.changeState(direction);
        } else {
            this.resetAutoStates();
        }
    }

    // Move the player and adjust the position
    movePlayerCarefully() {
        const { player, map } = this.game;

        if (this.isPositionalMovementValid(player.state)) {
            player.move(map.cellWidth, map.cellHeight);
            return true;
        }
        return false;
    }

    // Method to update player-related actions
    update() {
        this.updatePlayerMovement();
        const validMove = this.movePlayerCarefully();
        return validMove;
    }
}

export default BotPlayerController;