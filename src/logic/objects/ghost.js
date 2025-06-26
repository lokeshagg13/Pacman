import constants from "../../store/constants";

class Ghost {
    constructor({ position, indices, velocity, width, height, color = "red", promixityRadius = null }) {
        this.position = position; // center position
        this.indices = indices;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = color;
        this.promixityRadius = promixityRadius;
        this.state = null;
        this.distanceLimit = this.width * constants.MAP.DISTANCE_LIMIT;  // This is the min distance below which a ghost will be considered to have reached a target position

        // Initializing instance variables which are used in ghost controller
        this.randomSteps = 0;
        this.randomDirection = null;
        this.pathToPlayer = [];
        this.pathIndex = -1;
        this.targetCell = null;
        this.targetPosition = null;
    }

    // Change current state of the ghost
    changeState(newState) {
        this.state = newState;
    }

    // Get current bounding positions of the ghost
    getCurrentBoundingPositions() {
        return {
            top: this.position.y - this.height * 0.5,
            bottom: this.position.y + this.height * 0.5,
            left: this.position.x - this.width * 0.5,
            right: this.position.x + this.width * 0.5
        }
    }

    // Get bounding positions in a certain direction
    getNextStateBoundingPositions(direction, cellWidth, cellHeight) {
        const offsets = {
            up: { x: 0, y: -(cellHeight - this.height) / 2 },
            down: { x: 0, y: (cellHeight - this.height) / 2 },
            left: { x: -(cellWidth - this.width) / 2, y: 0 },
            right: { x: (cellWidth - this.width) / 2, y: 0 }
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

    // If ghost's movement takes it off the centres of the grid, snap it back to the grid
    snapToGrid(cellWidth, cellHeight) {
        if (this.state === "up" || this.state === "down") {
            this.position.x = Math.floor(this.position.x / cellWidth) * cellWidth + cellWidth / 2;
        } else if (this.state === "left" || this.state === "right") {
            this.position.y = Math.floor(this.position.y / cellHeight) * cellHeight + cellHeight / 2;
        }
    }

    // Move the ghost based on its current state
    move(cellWidth, cellHeight) {
        if (this.state === "up") this.position.y -= this.velocity.y;
        if (this.state === "down") this.position.y += this.velocity.y;
        if (this.state === "left") this.position.x -= this.velocity.x;
        if (this.state === "right") this.position.x += this.velocity.x;
        this.indices = {
            row: Math.floor(this.position.y / cellHeight),
            col: Math.floor(this.position.x / cellWidth)
        };
        this.snapToGrid(cellWidth, cellHeight);
    }

    // Check if ghost has reached its current target position or not
    hasReachedCurrentTarget() {
        const ghostPosition = this.position;
        const ghostCell = this.indices;
        if (
            ghostCell.row !== this.targetCell.row ||
            ghostCell.col !== this.targetCell.col
        ) return false;
        const distanceFromTarget = Math.hypot(
            ghostPosition.x - this.targetPosition.x,
            ghostPosition.y - this.targetPosition.y
        );
        if (distanceFromTarget >= this.distanceLimit) return false;
        return true;
    }

    isCollidingWithPlayer(player) {
        const playerCenterX = player.position.x;
        const playerCenterY = player.position.y;
        const playerRadiusX = player.radius.x;
        const playerRadiusY = player.radius.y;

        const ghostBounds = this.getCurrentBoundingPositions();
        const sideCenters = [
            {
                x: (ghostBounds.left + ghostBounds.right) / 2,
                y: ghostBounds.top
            },
            {
                x: (ghostBounds.left + ghostBounds.right) / 2,
                y: ghostBounds.bottom
            },
            {
                x: ghostBounds.left,
                y: (ghostBounds.top + ghostBounds.bottom) / 2
            },
            {
                x: ghostBounds.right,
                y: (ghostBounds.top + ghostBounds.bottom) / 2
            },
        ];

        return sideCenters.some(({ x, y }) => {
            const normalizedX = (x - playerCenterX) / playerRadiusX;
            const normalizedY = (y - playerCenterY) / playerRadiusY;
            return (normalizedX ** 2 + normalizedY ** 2) <= 1;
        });
    }

    // Draw the ghost
    draw(ctx, { showGhostProximityCircle = null }) {
        const { top, left } = this.getCurrentBoundingPositions();
        const legRadiusX = constants.GHOST.LEGS.RADIUS_PERC * this.width;
        const legRadiusY = constants.GHOST.LEGS.RADIUS_PERC * this.height;

        // Draw promixity circle if required
        if (showGhostProximityCircle) {
            const { x, y } = this.position;
            const { x: prX, y: prY } = this.promixityRadius;
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(x, y, prX, prY, 0, 0, Math.PI * 2);
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.restore();
        }

        // Draw body (arc for rounded top)
        const bodyHeight = this.height - legRadiusY;
        ctx.beginPath();
        ctx.arc(left + this.width / 2, top + this.height / 2, this.width / 2, Math.PI, 0, false);
        ctx.lineTo(left + this.width, top + bodyHeight);
        ctx.lineTo(left, top + bodyHeight);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw eyes
        const eyeRadius = constants.GHOST.EYES.RADIUS_PERC * this.width;
        const eyeOffsetX = constants.GHOST.EYES.OFFSET_PERC.X * this.width;
        const eyeOffsetY = constants.GHOST.EYES.OFFSET_PERC.Y * this.height;
        ctx.beginPath();
        ctx.arc(left + eyeOffsetX, top + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(left + this.width - eyeOffsetX, top + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.fillStyle = constants.GHOST.EYES.COLOR;
        ctx.fill();

        // Draw pupils
        const pupilRadius = constants.GHOST.EYES.PUPILS.RADIUS_PERC * eyeRadius;
        ctx.beginPath();
        ctx.arc(left + eyeOffsetX, top + eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.arc(left + this.width - eyeOffsetX, top + eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.fillStyle = constants.GHOST.EYES.PUPILS.COLOR;
        ctx.fill();

        // Draw legs (three ellipses at the bottom)
        ctx.beginPath();
        for (let i = 0; i < constants.GHOST.LEGS.COUNT; i++) {
            const legX = left + (2 * i + 1) * legRadiusX;
            const legY = top + this.height - legRadiusY;
            ctx.ellipse(legX, legY, legRadiusX, legRadiusY, 0, 0, Math.PI * 2);
        }
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

export default Ghost;