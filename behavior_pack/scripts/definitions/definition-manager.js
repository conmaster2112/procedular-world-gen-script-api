import { world } from "@minecraft/server";
import { NativeEvent } from "../utils";
import { BiomeManager } from "./biome-manager";

export class DefinitionManager{
    /**@readonly */
    finialize = new NativeEvent();
    /**@readonly */
    precalculate = new NativeEvent();
    /**@readonly */
    treeDefinitions = new Map();
    constructor(){
        this.biomeManager = new BiomeManager(this, null);
        this.__precalculated = world.getDynamicProperty("property-precalculated")??true;
        this.__precalculatedSamples = world.getDynamicProperty("property-precalculated-sampling")??15;
        if(this.__precalculatedSamples > 50) this.__precalculatedSamples = 50;
    }
    get IsPrecalculated(){return this.__precalculated;}
    set IsPrecalculated(v){return world.setDynamicProperty("property-precalculated", v);}
    get PrecalculatedSamples(){return this.__precalculatedSamples;}
    set PrecalculatedSamples(v){return world.setDynamicProperty("property-precalculated-sampling", v);}
    get IsPrecalculatedVariable(){return world.getDynamicProperty("property-precalculated")??false;}
    get IsPrecalculatedSamplesVariable(){return world.getDynamicProperty("property-precalculated-sampling")??10;}
    triggerFinialize(seed){
        this.finialize.subscribe(()=>{
            let time = Date.now();
            console.warn("PRECALUCLATION WITH SAMPLES: " + this.__precalculatedSamples);
            if(this.__precalculated) this.biomeManager.onPrecalculate(this.__precalculatedSamples, seed);
            console.warn("PRECALCULATED IN " + (Date.now() - time) + " ms");
        });
        return this.finialize.trigger(seed);
    }
}