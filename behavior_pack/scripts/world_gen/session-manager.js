import { Dimension, MinecraftDimensionTypes, world } from "@minecraft/server";
import { ProceduralRandom } from "../utils";
//import { definitionManager } from "../definitions/index";
import { ChunkGenerator } from "./generator";
import { DEFINITION_MANAGER } from "../definitions/index";

export class SessionManager{
    constructor(seed){
        this.generators = new Map();
        this.seed = Math.ceil(seed);
        this.procedural = new ProceduralRandom(this.seed);
        this.definition = DEFINITION_MANAGER;
        for(const dimensionId of [MinecraftDimensionTypes.overworld, MinecraftDimensionTypes.nether, MinecraftDimensionTypes.theEnd]){
            const dimension = world.getDimension(dimensionId);
            this.generators.set(dimension, new ChunkGenerator(this, dimension, this.procedural));
        }
    }
    /**@param {Dimension} dimension @returns {ChunkGenerator}  */
    get(dimension){ return this.generators.get(dimension); }
    isGenerated(hash){  return world.getDynamicProperty(hash);  }
    setGenerated(hash){ world.setDynamicProperty(hash, true); }
    getBiome(temp, humi){return this.definition.biomeManager.getBiome(temp, humi);}
}