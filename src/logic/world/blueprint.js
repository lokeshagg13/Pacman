import constants from "../../store/constants";
import blueprints from "./data/blueprints.json";

class Blueprint {
    static jailSymbol = constants.MAP.JAIL_SYMBOL;
    static spawnSymbols = Object.values(constants.MAP.SPAWN_SYMBOL);
    static movableSymbols = Blueprint.spawnSymbols.concat([
        constants.MAP.PELLET_SYMBOL, 
        constants.MAP.EMPTY_SPACE_SYMBOL
    ]);

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