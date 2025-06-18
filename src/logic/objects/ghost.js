class Ghost {
    constructor({ position, velocity, width, height, color = "red" }) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = color;
        this.state = null;
    }

    // Change current state of the player
    changeState(newState) {
        this.state = newState;
    }

    // Get current bounding positions of the player
    getCurrentBoundingPositions() {
        return {
            top: this.position.y - this.height / 2,
            bottom: this.position.y + this.width,
            left: this.position.x - this.width,
            right: this.position.x + this.radius.x
        }
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

    // Draw the ghost
    draw(ctx) {
        const { x, y } = this.position;

        // Draw body (arc for rounded top)
        ctx.beginPath();
        ctx.arc(x + this.width / 2, y + this.height / 2, this.width / 2, Math.PI, 0, false);
        ctx.lineTo(x + this.width, y + this.height);
        ctx.lineTo(x, y + this.height);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw eyes
        const eyeRadius = this.width * 0.2;
        const eyeOffsetX = this.width * 0.2;
        const eyeOffsetY = this.height * 0.3;
        ctx.beginPath();
        ctx.arc(x + eyeOffsetX, y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(x + this.width - eyeOffsetX, y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Draw pupils
        const pupilRadius = eyeRadius * 0.5;
        ctx.beginPath();
        ctx.arc(x + eyeOffsetX, y + eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.arc(x + this.width - eyeOffsetX, y + eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
    }
}

export default Ghost;