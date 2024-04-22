import { BiomeDefinition } from "./definition-biome";

export class BiomeManager{
    /**@param {import("./definition-manager").DefinitionManager} definition @param {BiomeDefinition} defaultBiome */
    constructor(definition, defaultBiome){
        this.definition = definition;
        this.biomes = [];
        this.table = null;
        this.default = defaultBiome;
        definition.finialize.subscribe(()=>this.selfFinialize());
    }
    addBiome(biome){ this.biomes.push(biome); }
    selfFinialize(){
        const mDistance = getSmallestDistance(
            [].concat(
                this.biomes.map(e=>e.temperature[0]),
                this.biomes.map(e=>e.temperature[1])
            )
        );
        let array = [];
        this.biomes.sort((a,b)=>(a.temperature[0] + a.temperature[1])/2 - (b.temperature[0] + b.temperature[1])/2)
        for(let i = 0; i < 1; i+=mDistance){
            const currentBiomes = [];
            const mappedBiomes = [];
            for(const biome of this.biomes){
                const {temperature:[min, max]} = biome;
                if(i >= min && i < max) currentBiomes.push(biome);
            }
            if(!currentBiomes.length) continue;
            const currentDistance = getSmallestDistance(
                [].concat(
                    currentBiomes.map(e=>e.humidity[0]),
                    currentBiomes.map(e=>e.humidity[1])
                )
            );
            mappedBiomes.sort((a,b)=>(a.humidity[0] + a.humidity[1])/2 - (b.humidity[0] + b.humidity[1])/2)
            for(let j = 0; j < 1; j+=currentDistance){
                for(const biome of currentBiomes){
                    const {humidity:[min, max]} = biome;
                    if(i => min && i < max) {mappedBiomes.push(biome); break;}
                    
                }
            }
            array.push(currentBiomes);
        }
        this.table = array;
    }
    /**@returns {BiomeDefinition} */
    getBiome(temperature, humidity){ return this.table.random(temperature)?.random(humidity)??this.default; }
    onPrecalculate(samples, seed){
        this.biomes.forEach(e=>e.onPrecalculate(samples, seed));
    }
}
function getSmallestDistance(numbers){
    numbers.sort((a,b)=> a - b);
    let smallest = Infinity;
    let l = 0;
    while(l++ < numbers.length){
        if(numbers[l] - numbers[l-1] < smallest && numbers[l] - numbers[l-1] !== 0) smallest = numbers[l] - numbers[l-1];
    }
    return smallest;
}