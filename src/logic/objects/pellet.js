import constants from "../../store/constants";

class Pellet {
    constructor({ position, radius }) {
        this.position = position;
        this.radius = radius;
    }

    isCollidingWithPlayer(player) {
        const playerCenterX = player.position.x;
        const playerCenterY = player.position.y;
        const playerRadiusX = player.radius.x;
        const playerRadiusY = player.radius.y;

        const distanceX = Math.abs(playerCenterX - this.position.x);
        const distanceY = Math.abs(playerCenterY - this.position.y);

        return (
            distanceX <= (playerRadiusX + this.radius.x) &&
            distanceY <= (playerRadiusY + this.radius.y)
        );
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.ellipse(
            this.position.x,
            this.position.y,
            this.radius.x,
            this.radius.y,
            0,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = constants.PELLET.COLOR;
        ctx.fill();
        ctx.closePath();
    }
}

export default Pellet;