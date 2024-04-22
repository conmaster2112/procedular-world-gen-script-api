import { Dimension, ListBlockVolume } from "@minecraft/server";
export class PalettedPlacer{
    constructor(){ this.palettes = new Map(); }
    /**@returns {import("@minecraft/server").Vector3[]} */
    getPaletteLocations(permutation){
        let palette = this.palettes.get(permutation);
        if(!palette) this.palettes.set(permutation, palette = []);
        return palette;
    }
    setPaletteLocations(permutation, locations){ this.palettes.set(permutation, locations); }
    setBlock(loc, permutation){ this.getPaletteLocations(permutation).push(loc); }
    /**@param {Dimension} dimension  */
    *flush(dimension, filterOption){
        for(const permutation of this.palettes.keys()){
            const list = this.palettes.get(permutation)??[];
            if(!list.length) continue;
            dimension.fillBlocks(new ListBlockVolume(list), permutation, filterOption??{});
            yield;
        }
        this.palettes.clear();
    }
}