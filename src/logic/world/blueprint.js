import constants from "../../store/constants";
import blueprints from "./data/blueprints.json";

class Blueprint {
    static jailSymbol = constants.JAIL_SYMBOL;
    static spawnSymbols = Object.values(constants.SPAWN_SYMBOL);
    static movableSymbols = Blueprint.spawnSymbols.concat(['.', '*']);

    static fetch() {
        return JSON.parse(JSON.stringify(blueprints[1].blueprint));
    }

    static findElementInBlueprint(element, blueprint) {
        for (let row = 0; row < blueprint.length; row++) {
            for (let col = 0; col < blueprint[row].length; col++) {
                if (blueprint[row][col] === element) {
                    return { row, col };
                }
            }
        }
        return null;
    }
}

export default Blueprint;