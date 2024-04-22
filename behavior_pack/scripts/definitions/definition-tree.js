import { BlockPermutation, Dimension, ListBlockVolume } from "@minecraft/server";
import { PalettedPlacer, ProceduralRandom } from "../utils";

export class CompiledTreeSmaple{
    constructor(){ 
        /**@type {Map<BlockPermutation, import("@minecraft/server").Vector3[]>} */
        this.lists = new Map();
    }
    placePaleteLike(){return this.lists.entries();}
    [Symbol.iterator](){return this.lists.entries();}
}
export class TreeDefinition{
    constructor(id){
        this.id = id;
        this.IsPrecalculated = false;
        this.samples = [];
    }
    /**
     * 
     * @param {import("@minecraft/server").Vector3 & Dimension} location 
     * @param {ProceduralRandom} seed 
     * @param {PalettedPlacer} placer 
     */
    *build(location, seed, placer){ throw new ReferenceError("Abstract implementation error"); }
    /**
     * 
     * @param {import("@minecraft/server").Vector3 & Dimension} location 
     * @param {ProceduralRandom} seed 
     * @param {PalettedPlacer} placer 
     */
    place(location, seed, placer){ return this.build(location, seed, placer); }
    onPrecalculate(samples, seed){
        samples ??= 5;
        this.IsPrecalculated = true;
        while(samples-- > 0){
            const placer = new PalettedPlacer();
            for(const empty of this.build({x:0,y:0,z:0}, seed, placer));
            const sample = new CompiledTreeSmaple();
            for(const [p, list] of placer.palettes.entries()) {
                const volume = new ListBlockVolume(list);
                const newList = [];
                for(const a of volume.getBlockLocationIterator()) newList.push(a);
                sample.lists.set(p, newList);
            }
            this.samples.push(sample);
        }
    }
    /**@returns {CompiledTreeSmaple} */
    getCompiledSample(r){ return this.samples.random(r); }
}
export class PillarTreeDefinition extends TreeDefinition{
    constructor(){
        super();
        this.height = [3, 10];
        this.logPaletted = BlockPermutation.resolve("spruce_log");
        this.canPlaceValidator = ()=>true;
    }
    setCanPlaceValidator(p){this.canPlaceValidator = p; return this;}
    /**
     * @default "spruce_log"
     */
    setLogPaletted(p){
        this.logPaletted = p;
        return this;
    }
    /**@default range [3, 10]} */
    setHeight(min, max){
        this.height[0] = min;
        this.height[1] = max??min;
        return this;
    }
    /**
     * 
     * @param {import("@minecraft/server").Vector3 & {dimension: Dimension}} location 
     * @param {ProceduralRandom} seed 
     * @param {PalettedPlacer} placer 
     */
    *build(location, seed, placer){
        const {x,y,z} = location;
        const h =  seed.nextFloat() * (this.height[1] - this.height[0]) + this.height[0]
        for(let Y = 0; Y < h; Y++) {
            placer.setBlock({x: x + 0.5, y:y + Y, z: z + 0.5}, this.logPaletted.toPermutation(seed.nextFloat()));
        }
    }
}
export class SpruceTreeDefinition extends PillarTreeDefinition{
    constructor(){
        super();
        this.offset = [1, 2];
        this.leavesPaletted = BlockPermutation.resolve("spruce_leaves");
    }
    /**
     * @default "spruce_leaves"
     */
    setLeavesPaletted(p){
        this.leavesPaletted = p;
        return this;
    }
    /**@default range [1, 3]} */
    setOffSet(min, max){
        this.offset[0] = min;
        this.offset[1] = max??min;
        return this;
    }
    /**
     * 
     * @param {import("@minecraft/server").Vector3 & {dimension: Dimension}} location 
     * @param {ProceduralRandom} seed 
     * @param {PalettedPlacer} placer 
     */
    *build(location, seed, placer){
        const {x,y,z} = location;
        const add = seed.nextFloat() * (this.offset[1] - this.offset[0]) + this.offset[0];
        const h =  seed.nextFloat() * (this.height[1] - this.height[0]) + this.height[0];
        const height = h + add;
        for(let Y = 0; Y < height; Y++) {
            let max = height - Y + 1;
            if(Y < height - 1) placer.setBlock({x: x, y:y + Y, z: z}, this.logPaletted.toPermutation(seed.nextFloat()));
            else placer.setBlock({x: x + 0.5, y:y + Y, z: z + 0.5}, this.leavesPaletted.toPermutation(seed.nextFloat()));
            if(Y >= add) for (let i = 0.5; i < max; i+=0.8){
                let count  = i * Math.PI;
                for(let j = 0; j < count; j++){
                    const distance = seed.nextFloat() * i / 3 + 0.2;
                    const rot = seed.nextFloat() * Math.PI * 2;
                    placer.setBlock({
                        x: x + Math.sin(rot) * distance + 0.5,
                        y: y + Y,
                        z: z + Math.cos(rot) * distance + 0.5
                    }, this.leavesPaletted.toPermutation(seed.nextFloat()))
                }
                yield;
            }
        }
    }
}
export class CuttedSpruceTreeDefinition extends PillarTreeDefinition{
    constructor(){
        super();
        this.carpetPaletted = BlockPermutation.resolve("moss_carpet");
    }
    /**
     * @default "moss_carpet"
     */
    setCarpetPaletted(p){
        this.carpetPaletted = p;
        return this;
    }
    /**
     * 
     * @param {import("@minecraft/server").Vector3 & {dimension: Dimension}} location 
     * @param {ProceduralRandom} seed 
     * @param {PalettedPlacer} placer 
     */
    *build(location, seed, placer){
        const {x,y,z} = location;
        const h =  seed.nextFloat() * (this.height[1] - this.height[0]) + this.height[0];
        let lastHeights = [];
        for(let Y = -2; Y < h; Y++) {
            if(Y < h - 1){
                placer.setBlock({x: x+1, y:(lastHeights[0] = y + Y), z: z+1}, this.logPaletted.toPermutation(seed.nextFloat()));
                placer.setBlock({x: x+1, y:(lastHeights[1] = y + Y), z: z}, this.logPaletted.toPermutation(seed.nextFloat()));
                placer.setBlock({x: x, y:(lastHeights[2] = y + Y), z: z+1}, this.logPaletted.toPermutation(seed.nextFloat()));
                placer.setBlock({x: x, y:(lastHeights[3] = y + Y), z: z}, this.logPaletted.toPermutation(seed.nextFloat()));
            }else{
                if(seed.nextFloat() < 0.4) placer.setBlock({x: x+1, y:(lastHeights[0] = y + Y), z: z+1}, this.logPaletted.toPermutation(seed.nextFloat()));
                if(seed.nextFloat() < 0.4) placer.setBlock({x: x+1, y:(lastHeights[1] = y + Y), z: z}, this.logPaletted.toPermutation(seed.nextFloat()));
                if(seed.nextFloat() < 0.4) placer.setBlock({x: x, y:(lastHeights[2] = y + Y), z: z+1}, this.logPaletted.toPermutation(seed.nextFloat()));
                if(seed.nextFloat() < 0.4) placer.setBlock({x: x, y:(lastHeights[3] = y + Y), z: z}, this.logPaletted.toPermutation(seed.nextFloat()));
            }
        }
        placer.setBlock({x: x+1, y:lastHeights[0]+1, z: z+1}, this.carpetPaletted.toPermutation(seed.nextFloat()));
        placer.setBlock({x: x+1, y:lastHeights[1]+1, z: z}, this.carpetPaletted.toPermutation(seed.nextFloat()));
        placer.setBlock({x: x, y:lastHeights[2]+1, z: z+1}, this.carpetPaletted.toPermutation(seed.nextFloat()));
        placer.setBlock({x: x, y:lastHeights[3]+1, z: z}, this.carpetPaletted.toPermutation(seed.nextFloat()));
    }
}
export class TreePalette{
    constructor(){ this.trees = []; }
    add(treeDefinition, num){
        let value = num??1;
        while(value--) this.trees.push(treeDefinition);
        return this;
    }
    /**@returns {TreeDefinition} */
    get(random){ return this.trees.random(random); }
    onPrecalculate(samples, seed){
        for(const tree of this.trees) if(!tree.IsPrecalculated) tree.onPrecalculate(samples, seed);
    }
}