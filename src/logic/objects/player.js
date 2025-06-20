import constants from "../../store/constants";

class Player {
    constructor({ position, velocity, radius }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.visualRadius = {
            x: radius.x * 0.8,
            y: radius.y * 0.8
        };
        this.state = null;
        this.dyingAngles = null;

        // Mouth animation properties
        this.mouthRate = 1; // Range: 0 (closed) to 1 (fully open)
        this.mouthDirection = -1; // 1 for opening, -1 for closing
        this.mouthSpeed = 0.1; // Rate of change for mouth animation
    }

    // Change current state of the player
    changeState(newState) {
        this.state = newState;
    }

    // Get current bounding positions of the player
    getCurrentBoundingPositions() {
        return {
            top: this.position.y - this.radius.y,
            bottom: this.position.y + this.radius.y,
            left: this.position.x - this.radius.x,
            right: this.position.x + this.radius.x
        };
    }

    // Get bounding positions in a certain direction
    getNextStateBoundingPositions(direction, cellWidth, cellHeight) {
        const offsets = {
            up: { x: 0, y: -(cellHeight / 2 - this.radius.y) },
            down: { x: 0, y: cellHeight / 2 - this.radius.y },
            left: { x: -(cellWidth / 2 - this.radius.x), y: 0 },
            right: { x: cellWidth / 2 - this.radius.x, y: 0 }
        };

        const { x: offsetX = 0, y: offsetY = 0 } = offsets[direction] || {};

        const { top, bottom, left, right } = this.getCurrentBoundingPositions();

        return {
            top: top + offsetY,
            bottom: bottom + offsetY,
            left: left + offsetX,
            right: right + offsetX
        };
    }

    // If player's movement takes it off the centres of the grid, snap it back to the grid
    snapToGrid(cellWidth, cellHeight) {
        if (this.state === "up" || this.state === "down") {
            this.position.x = Math.floor(this.position.x / cellWidth) * cellWidth + cellWidth / 2;
        } else if (this.state === "left" || this.state === "right") {
            this.position.y = Math.floor(this.position.y / cellHeight) * cellHeight + cellHeight / 2;
        }
    }

    // Move the player based on its current state
    move() {
        if (this.state === "up") this.position.y -= this.velocity.y;
        if (this.state === "down") this.position.y += this.velocity.y;
        if (this.state === "left") this.position.x -= this.velocity.x;
        if (this.state === "right") this.position.x += this.velocity.x;
    }

    // Calculate angles for mouth opening of the pacman player and adjust mouth angles based on state and mouthRate
    getMouthingAngles() {
        const currentOpening = constants.PLAYER_MAX_MOUTH_OPENING * this.mouthRate;
        let startAngle = 0 * Math.PI + currentOpening;
        let endAngle = 2 * Math.PI - currentOpening;
        if (this.state === "down") {
            startAngle = 0.5 * Math.PI + currentOpening;
            endAngle = 2.5 * Math.PI - currentOpening;
        } else if (this.state === "left") {
            startAngle = 1 * Math.PI + currentOpening;
            endAngle = 3 * Math.PI - currentOpening;
        } else if (this.state === "up") {
            startAngle = 1.5 * Math.PI + currentOpening;
            endAngle = 3.5 * Math.PI - currentOpening;
        }
        return { startAngle, endAngle };
    }

    // Animate the mouth opening and closing
    updateMouthAnimation() {
        this.mouthRate += this.mouthDirection * this.mouthSpeed;
        if (this.mouthRate >= 1 || this.mouthRate <= 0) {
            this.mouthDirection *= -1;
        }
    }

    // Animate the player for dying
    runDyingAnimation(callback) {
        let currentStartAngle = (-90 * Math.PI) / 180;
        let currentEndAngle = (270 * Math.PI) / 180;
        const targetAngle = (90 * Math.PI) / 180;
        const step = (2.5 * Math.PI) / 180;

        // Update the dying state for the player
        this.state = "dying";

        const animate = () => {
            if (currentStartAngle >= targetAngle) {
                this.state = null;
                if (typeof callback === "function") {
                    callback();
                }
                return;
            }

            currentStartAngle += step;
            currentEndAngle -= step;

            this.dyingAngles = { startAngle: currentStartAngle, endAngle: currentEndAngle };
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Draw the pacman player
    draw(ctx) {
        const { startAngle, endAngle } = this.state === "dying" ? this.dyingAngles : this.getMouthingAngles();

        // Draw Pacman
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(0);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.ellipse(
            0,
            0,
            this.visualRadius.x,
            this.visualRadius.y,
            0,
            startAngle,
            endAngle
        );
        ctx.lineTo(0, 0);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

export default Player;