import { BlockPermutation, BlockVolume, Dimension, system } from "@minecraft/server";
import { easeOutQuad, proximityEaseing, FastNoiseLite, PalettedPlacer, ProceduralRandom, Vec3 } from "../utils";

const air = BlockPermutation.resolve("air");
const water = BlockPermutation.resolve("water");
const seaLevel = -40;
const entry = -60;


export class ChunkGenerator{
    /**@param {Dimension} dimension @param {import("./session-manager").SessionManager} sessionManager @param {ProceduralRandom} seed */
    constructor(sessionManager, dimension, seed){
        this.seaLevel = seaLevel;
        this.entry = entry;
        this.manager = sessionManager;
        this.dimension = dimension;
        this.dimensionId = dimension.id;
        this.range = dimension.heightRange;
        this.building = new Set();
        this.seed = seed;
        const biomeFactor = (1/(this.manager.definition.biomeManager.biomes.length*2 + 10))/200;
        // base
        this.base = new FastNoiseLite(seed.nextInt());
        this.base.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
        this.base.SetFractalType(FastNoiseLite.FractalType.FBm);
        this.base.SetFractalOctaves(2);
        // Spikes
        this.spikes = new FastNoiseLite(seed.nextInt());
        this.spikes.SetNoiseType(FastNoiseLite.NoiseType.Cellular);
        this.spikes.SetCellularJitter(1.2);
        this.spikes.SetFrequency(0.02);
        // Kind - Flat/Peaky
        this.kind = new FastNoiseLite(seed.nextInt());
        this.kind.SetFrequency(0.0008);
        // overall - OverAllGeneration
        this.overall = new FastNoiseLite(seed.nextInt());
        this.overall.SetFrequency(0.02);
        // deep - Flat/Peaky
        this.deep = new FastNoiseLite(seed.nextInt());
        this.deep.SetFrequency(0.0004);
        // trees
        this.trees = new FastNoiseLite(seed.nextInt());
        this.trees.SetFrequency(0.003);
        // temp
        this.temp = new FastNoiseLite(seed.nextInt());
        this.temp.SetFrequency(biomeFactor * 0.5);
        // temp
        this.humi = new FastNoiseLite(seed.nextInt());
        this.humi.SetFrequency(biomeFactor * 0.75);
    }
    getStats(x, z){
        const {base, spikes, kind, overall, deep, temp, humi} = this,
        s = ((spikes.GetNoise(x, z)*0.7 + 1)), //z2 1.5;
        b = ((base.GetNoise(x, z) + 1)), //z2 s8
        k = kind.GetNoise(x, z) / 2, //proximity10 * z2
        o = ((overall.GetNoise(x, z) + 1) / 2), //proximity7 * z2 * s10
        d = ((deep.GetNoise(x, z) + 1) / 2);
        const waterPropriety = proximityEaseing(d, 20);
        const temperature = (temp.GetNoise(x, z)+1)/2;
        const humidity = (humi.GetNoise(x, z)+1)/2;
        return {
            s,b,k,o,d,waterPropriety,
            temperature, humidity,
            height: (s * 2.5 * (0.8 + k) + b * proximityEaseing(0.5 + k, 10) * 8 + proximityEaseing(o, 7) * (0.8 + k)) * (waterPropriety / 2 + 0.5) + waterPropriety * 3.5
        };
    }
    isGenerating = new Set();
    buildChunk(X, Z, hash){
        if(this.isGenerating.has(hash)) return Promise.resolve();
        if(this.isGenerated(hash)) return Promise.resolve();
        const task = new Promise((r,j)=>system.runJob(this.generate(X,Z,r,j)));
        this.isGenerating.add(hash);
        task.then(()=>this.setGenerated(hash))
        .catch(e=>console.error(e, e.stack))
        .finally(()=>this.isGenerating.delete(hash));
        return task;
    }
    isGenerated(hash){  return this.manager.isGenerated(hash + this.dimensionId); }
    setGenerated(hash){ this.manager.setGenerated(hash + this.dimensionId); }
    *generate(X, Z, res, rej){
        const {seaLevel, entry, dimension: d} = this;
        const mainPalette = new PalettedPlacer();
        const secondPalette = new PalettedPlacer();
        let errorCount = 0;
        try {
            let theLowest = Infinity;
            let concepts = [];
            const stats = [];
            const random = this.seed.getSeqence(X, Z);
            const postProccess = [];
            const trees = [];
            X = X*16, Z = Z*16;
            /// FIRST LAYER CALCULATION
            for (let x = 0; x < 16; x++){
                for (let z = 0; z < 16; z++) {
                    const xx = X + x, zz = Z + z;
                    const index = x*16 + z;
                    const index2 = x*16 + (z>14?256+z:z+1);

                    const currentStats = stats[index]??(stats[index] = this.getStats(xx, zz));
                    let terrain = currentStats.height * 10;
                    let terrain2 = (stats[index2]??(stats[index2] = this.getStats(xx, zz + 1))).height * 10;
                    let terrain3 = (stats[index + 16]??(stats[index + 16] = this.getStats(xx + 1, zz))).height * 10;

                    const {
                        groundPaletted, 
                        underGroundPaletted, 
                        vegetationPalette,
                        vegetationChance,
                        trees:treePalete,
                        hasTrees,
                        treesChance,
                        treeAreaChance,
                        vegetationValidation
                    } = this.getBiome(currentStats.temperature, currentStats.humidity);
                    let sklon = Math.sqrt((terrain - terrain2)**2 + (terrain - terrain3)**2);
                    terrain += entry;
                    const underSeaLevel = terrain < seaLevel;
                    if(theLowest>terrain) theLowest = terrain;
                    if(underSeaLevel) {
                        mainPalette.setBlock(concepts[index] = {x:xx,z:zz,y: terrain, underGroundPaletted}, underGroundPaletted.toPermutation(random.nextFloat()) /*biome.nextUnderGround(random)*/);
                    }
                    else if(sklon*(random.nextFloat()*0.4 + 0.6) > 1.5){
                        mainPalette.setBlock(concepts[index] = {x:xx,z:zz,y: terrain, underGroundPaletted}, underGroundPaletted.toPermutation(random.nextFloat()) /*biome.nextUnderGround(random)*/);
                    }
                    else{
                        if(random.nextFloat() < vegetationChance) postProccess.push({x:xx,z:zz,y: terrain + 1, vegetationPalette, vegetationValidation});
                        if(
                            random.nextFloat() < treesChance && 
                            easeOutQuad((this.trees.GetNoise(xx, zz) + 1)/2) < treeAreaChance
                            && hasTrees) trees.push({x:xx,z:zz,y: terrain + 1, treePalete, dimension:d});
                        mainPalette.setBlock(
                            concepts[index] = {x:xx,z:zz,y: terrain, underGroundPaletted},
                            groundPaletted.toPermutation(random.nextFloat()) //biome.nextGround(random)
                        );
                    }
                }
                yield;
            }

            /// PROCESSING UNDER LAYER RE-FILL
            for(const {x,y,z, underGroundPaletted} of concepts){
                for(let i = theLowest - 1; i < y; i++) {
                    secondPalette.setBlock({x,y:i,z}, underGroundPaletted.toPermutation(random.nextFloat()));
                }
                yield;
            }
            yield * secondPalette.flush(d, {ignoreChunkBoundErrors: true, blockFilter:{includePermutations:[air]}});
            yield * mainPalette.flush(d, {ignoreChunkBoundErrors: true});
            yield;
            //yield * palette.flush(d, {ignoreChunkBoundErrors: true});

            ///
            if(this.manager.definition.IsPrecalculated){
                for(let loc of trees) {
                    const treedDef = loc.treePalete.get(random.nextFloat());
                    const offSetCalculator = Vec3.add.bind(Vec3, loc);
                    if(treedDef.canPlaceValidator(loc)) {
                        const sample = treedDef.getCompiledSample(random.nextFloat());
                        for(const [permutation, list] of sample){
                            const locations = mainPalette.getPaletteLocations(permutation);
                            mainPalette.setPaletteLocations(permutation,locations.concat(list.map(offSetCalculator)))
                        }
                        yield;
                    }
                }
            }else{
                for(const loc of trees) {
                    const treedDef = loc.treePalete.get(random.nextFloat());
                    if(treedDef.canPlaceValidator(loc)) yield * treedDef.place(loc, random, mainPalette);
                }
            }          
            yield;
            
            for(const loc of postProccess){
                const p = loc.vegetationPalette.toPermutation(random.nextFloat()); //biome.nextLife(random)
                const block = d.getBlock(loc);
                if(block === undefined) errorCount++;
                else if(block?.canPlace(p)) mainPalette.setBlock(loc, p);
                yield;
            }
            yield * mainPalette.flush(d, {ignoreChunkBoundErrors: true, blockFilter:{includePermutations:[air]}});

            /// PROCESSING UNDER LAYER RE-FILL
            /*
            for(const {x,y,z} of concepts){
                for(let i = theLowest - 1; i < y; i++) {
                    palette.setBlock({x,y:i,z}, biome.nextUnderGround(random));
                }
                yield;
            }
            yield * palette.flush(d, {ignoreChunkBoundErrors: true, blockFilter:{includePermutations:[air]}});*/
            //Sea level filler
            while(theLowest > this.range.min){
                const distance = Math.min(16, theLowest - this.range.min);
                d.fillBlocks(new BlockVolume({x:X, y:theLowest, z:Z},{x:X + 15, y: theLowest-= distance, z:Z + 15}), "stone", {
                    blockFilter:{
                        includePermutations:[air],
                        includeTags:["water"],
                    },
                    ignoreChunkBoundErrors:true
                });
                yield;
            }            
            /// CHUNK FINIALIZER
            if(theLowest < seaLevel){
                d.fillBlocks(new BlockVolume({x:X, y:seaLevel, z:Z},{x:X + 15, y:theLowest, z:Z + 15}), water, {
                    blockFilter:{
                        includePermutations:[air],
                        includeTags:["water"],
                    },
                    ignoreChunkBoundErrors:true
                });
            }
            if(errorCount) console.warn("Failing to get blocks, error count: " + errorCount + ". Try increasing your simulation distance, or lower the generation distance in settings.");
            res();
        } catch (error) {
            rej(error);
        }
    }
    getBiome(temp, humi){ return this.manager.getBiome(temp, humi); }
    getHeight(x, z){ return Math.max(this.getStats(x, z).height * 10 + this.entry, this.seaLevel + 1); }
}