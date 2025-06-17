class Pellet {
    constructor({ position, radius }) {
        this.position = position;
        this.radius = radius;
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
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

export default Pellet;