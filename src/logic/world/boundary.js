import PipeHorizontalImage from "../../images/assets/pipeHorizontal.svg";
import PipeVerticalImage from "../../images/assets/pipeVertical.svg";
import PipeCorner1Image from "../../images/assets/pipeCorner1.svg";
import PipeCorner2Image from "../../images/assets/pipeCorner2.svg";
import PipeCorner3Image from "../../images/assets/pipeCorner3.svg";
import PipeCorner4Image from "../../images/assets/pipeCorner4.svg";
import PipeCrossImage from "../../images/assets/pipeCross.svg";
import PipeConnectorTopImage from "../../images/assets/pipeConnectorTop.svg";
import PipeConnectorBottomImage from "../../images/assets/pipeConnectorBottom.svg";
import PipeConnectorLeftImage from "../../images/assets/pipeConnectorLeft.svg";
import PipeConnectorRightImage from "../../images/assets/pipeConnectorRight.svg";
import CapLeftImage from "../../images/assets/capLeft.svg";
import CapRightImage from "../../images/assets/capRight.svg";
import CapTopImage from "../../images/assets/capTop.svg";
import CapBottomImage from "../../images/assets/capBottom.svg";
import BlockImage from "../../images/assets/block.svg";

class Boundary {
    constructor({ symbol, position, width, height }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.boundingBox = this.#calculateBoundingBox()

        this.symbol = symbol;
        this.image = this.#getImageBasedOnSymbol(symbol);
    }

    #calculateBoundingBox() {
        return {
            top: this.position.y,
            bottom: this.position.y + this.height,
            left: this.position.x,
            right: this.position.x + this.width
        };
    }

    #getImageBasedOnSymbol(symbol) {
        const createImage = (src) => {
            const image = new Image();
            image.src = src;
            return image;
        };

        switch (symbol) {
            case '-': return createImage(PipeHorizontalImage);
            case '|': return createImage(PipeVerticalImage);
            case '1': return createImage(PipeCorner1Image);
            case '2': return createImage(PipeCorner2Image);
            case '3': return createImage(PipeCorner3Image);
            case '4': return createImage(PipeCorner4Image);
            case 'b': return createImage(BlockImage);
            case '[': return createImage(CapLeftImage);
            case ']': return createImage(CapRightImage);
            case '^': return createImage(CapTopImage);
            case '_': return createImage(CapBottomImage);
            case '+': return createImage(PipeCrossImage);
            case '5': return createImage(PipeConnectorTopImage);
            case '6': return createImage(PipeConnectorRightImage);
            case '7': return createImage(PipeConnectorBottomImage);
            case '8': return createImage(PipeConnectorLeftImage);
            default: return createImage(PipeHorizontalImage);
        }
    }
    
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}

export default Boundary;