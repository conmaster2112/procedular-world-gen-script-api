import { system } from "@minecraft/server";
import { SessionManager } from "../world_gen/index";
import { DEFINITION_MANAGER } from "../definitions/index";

const CLIENT_CHUNKS = new WeakMap();
export class ClientChunk {
    /**@param {Player} player @param {SessionManager} sessionManager @returns {ClientChunk} */
    static open(sessionManager, player){
        let m = CLIENT_CHUNKS.get(player);
        if(!m) CLIENT_CHUNKS.set(player, m = new this(player, sessionManager));
        return m;
    }
    /**@param {Player} player @param {SessionManager} sessionManager */
    constructor(player, sessionManager){ 
        this.player = player; 
        this.manager = sessionManager;
        this.biomes = DEFINITION_MANAGER.biomeManager;
    }
    lastChunks = [];
    viewDistance = 8;
    maxJobs = 4;
    lastVisitedChunk = "";
    tasks = new Set();
    currentArea = new Set();
    knownUnrenderedChunks = new Map();
    id = null;
    runTick = 0n;
    get emptyTasks(){ return this.maxJobs - this.tasks.size; }
    get chunkXZ(){
        const {x,z} = this.player.location;
        return {x: Math.ceil(x/16), z: Math.ceil(z/16)};
    }
    get isRunning(){return typeof this.id === "number";}
    get currentGenerator(){return this.manager.get(this.player.dimension);}
    isGenerated(){return this.currentGenerator.isGenerated(this.getKey(this.chunkXZ));}
    getKey(loc){return `${loc.x};${loc.z}`;}
    start(){
        this.id = system.runInterval(()=>this._tick().catch(e=>console.error(e,e?.stack)));
    }
    stop(){
        if(this.isRunning) system.clearRun(this.id);
    }
    _recalc2(X, Z){
        this.priorities = [];
        const newArea = new Set();
        const r = this.viewDistance;
        let power = r ** 2;
        for (let x = -r; x < r; x++) {
            for (let z = -r; z < r; z++) {
                const R = x ** 2 + z ** 2;
                if (R > power) continue;
                const xx = X + x;
                const zz = Z + z;
                const key = `${xx};${zz}`;
                newArea.add(key);
                const priority = Math.floor(R**0.5);
                const p = this.priorities[priority]??(this.priorities[priority]=[]);
                if (!this.currentArea.delete(key)) this.knownUnrenderedChunks.set(key, {x:xx,z:zz, key}); 
                if(this.knownUnrenderedChunks.has(key)) p.push(key);
            }
        }
        for(const key of this.currentArea) this.knownUnrenderedChunks.delete(key);
        this.currentArea = newArea;
        return this.priorities; 
    }
    _recalc(X, Z){
        const newChunks = [];
        const queue = [{x:0,z:0}];
        const newArea = new Set();
        const curArea = this.currentArea;
        const P = this.viewDistance ** 2;
        const t = {};
        while(queue.length){
            let loc = queue.shift();
            const {x,z} = loc;
            const R = x ** 2 + z ** 2;
            if (R > P) continue;
            const xx = X + x;
            const zz = Z + z;
            const key = `${xx};${zz}`;
            if(t[key]) continue;
            t[key] = true;
            newArea.add(key);
            let isNewChunk = !curArea.delete(key);
            const newLoc = {x:xx, z:zz, key};
            if(isNewChunk) this.knownUnrenderedChunks.set(key, newLoc);
            if (isNewChunk || this.knownUnrenderedChunks.has(key)) newChunks.push(newLoc);
            queue.push({x:x+1, z});
            queue.push({x, z:z+1});
            queue.push({x:x-1, z});
            queue.push({x, z:z-1});
        }
        for(const key of curArea) this.knownUnrenderedChunks.delete(key);
        this.currentArea = newArea;
        return newChunks;
    }
    _generateChunk(x,z, hash){
        const task = this.currentGenerator.buildChunk(x,z, hash).catch((e)=>console.error(e,e?.stack));
        task.finally(()=>this.tasks.delete(task));
        this.tasks.add(task);
        return task;
    }
    async _tick(){
        const {x:X,z:Z} = this.chunkXZ;
        const key = `${X};${Z}`;
        let emptyTasks = this.emptyTasks;

        
        const {x,z} = this.player.location;
        if(this.player._debug){
            const a = this.currentGenerator.getStats(x, z);
            //console.warn(JSON.stringify(a));
            const {temperature, humidity} = a;
            const biome = this.biomes.getBiome(temperature, humidity);
    
            if(this.runTick++ & 1n) this._showDebug(biome);
        }
        if(!emptyTasks) return;
        const priorities = (this.lastVisitedChunk === (this.lastVisitedChunk = key))?this.priorities:this._recalc2(X,Z);
        let i = 0;
        main: for(let o = 0; o < priorities.length; o++){
            const major = priorities[o]??[];
            while(major.length){
                if(++i > emptyTasks) break main;
                const key = major.shift();
                const loc = this.knownUnrenderedChunks.get(key);
                if(loc) {
                    this.knownUnrenderedChunks.delete(key);
                    this._generateChunk(loc.x, loc.z, key);
                }
            }
        }
    }
    _showDebug(b){
        this.player.onScreenDisplay.setActionBar([
            `§7Running Tasks:§n§l ${this.tasks.size} §7/§n§l ${this.maxJobs}`,
            `§7Queue: §n§l${this.knownUnrenderedChunks.size}§r§7 chunks`,
            `§7Biome: §n§l${b.id}`,
            "§7Radius: §n§l" + this.viewDistance + "§r§7 chunks",
            "§7Seed: §n§l" + this.manager.seed,
        ].join("\n§r"));
    }
}