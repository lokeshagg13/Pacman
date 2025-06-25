import PlayerController from "./playerController";

class HumanPlayerController extends PlayerController {
    constructor(game) {
        super(game);

        this.swipeState = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.keyState = {
            w: false,
            s: false,
            a: false,
            d: false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.lastActionType = null; // key / swipe
        this.lastActionValue = "";
    }

    // Reset swipe states
    resetSwipeStates() {
        for (let dir in this.swipeState) {
            if (this.swipeState.hasOwnProperty(dir)) {
                this.swipeState[dir] = false;
            }
        }
    }

    // Update player's movement state based on key presses or swipes
    updatePlayerMovement() {
        if (this.lastActionType === "key") {
            const directionKeys = {
                w: "up", ArrowUp: "up",
                s: "down", ArrowDown: "down",
                a: "left", ArrowLeft: "left",
                d: "right", ArrowRight: "right"
            };
            const direction = directionKeys[this.lastActionValue];
            if (
                direction && this.keyState[this.lastActionValue] &&
                this.isOverallPlayerMovementValid(direction)
            ) {
                this.game.player.changeState(direction);
            }
        } else if (this.lastActionType === "swipe") {
            const direction = this.lastActionValue;
            if (
                direction && this.swipeState[this.lastActionValue] && this.isOverallPlayerMovementValid(direction)
            ) {
                this.game.player.changeState(direction);
            } else {
                this.resetSwipeStates();
            }
        }
    }

    // Move the player and adjust the position
    movePlayerCarefully() {
        const { player, map } = this.game;

        if (this.isPositionalMovementValid(player.state)) {
            player.move(map.cellWidth, map.cellHeight);
        }
    }

    // Method to update player-related actions
    update() {
        this.updatePlayerMovement();
        this.movePlayerCarefully();
    }
}

export default HumanPlayerController;