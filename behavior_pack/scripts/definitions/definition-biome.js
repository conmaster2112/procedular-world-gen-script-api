import { PalettedBrush } from "../utils";
import { TreePalette } from "./definition-tree";

export class BiomeDefinition{
    /**@param {string} id */
    constructor(id){
        this.id =  id;
        this.trees = new TreePalette();
        this.treesChance = 0.02;
        this.treeAreaChance = 0.5;
        this.temperature = [0,1];
        this.humidity = [0,1];
        this.groundPaletted = new PalettedBrush();
        this.underGroundPaletted = new PalettedBrush();
        this.vegetationPalette = new PalettedBrush();
        this.vegetationChance = 0.1;
        this.vegetationValidation = true;
        this.IsPrecalculated = false;
    }
    onPrecalculate(samples,seed){ 
        this.trees.onPrecalculate(samples, seed);
        this.IsPrecalculated = true;
    }
    /**@default 0.02 */
    setTreesChance(p){
        this.treesChance = p;
        return this;
    }
    /**@default 0.5 */
    setTreesAreaChance(p){
        this.treeAreaChance = p;
        return this;
    }
    setTrees(p){
        this.trees = p;
        return this;
    }
    setTemperature(min, max){
        this.temperature = [min, max];
        return this;
    }
    setHumidity(min, max){
        this.humidity = [min, max];
        return this;
    }
    setGroundPalette(p){this.groundPaletted = p; return this;}
    setUnderGroundPalette(p){this.underGroundPaletted = p; return this;}
    setVegetationPalette(p){this.vegetationPalette = p; return this;}
    /**@default true @deprecated */
    setVegetationValidation(p){
        this.vegetationValidation =p;
        return this;
    }
    /**@default 0.1 */
    setVegetationChance(p){this.vegetationChance = p; return this;}
    get hasTrees(){return this.trees.trees.length;}
    getTreeDefinition(random){return this.trees.get(random.nextFloat());}
}