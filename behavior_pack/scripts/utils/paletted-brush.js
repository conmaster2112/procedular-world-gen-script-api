import { BlockPermutation } from "@minecraft/server";

const bedrock = BlockPermutation.resolve("bedrock");
export class PalettedBrush{
    constructor(){ this.permutations = []; this.uniques = new Set(); }
    add(type, repeat){
        repeat = repeat??1;
        const p = type.toPermutation();
        this.uniques.add(p);
        while(repeat--) this.permutations.push(p);
        return this;
    }
    addArray(list){ for(const entry of list) this.add(entry); return this;}
    next(r = Math.random()){ return this.permutations[Math.floor(r * this.permutations.length)]??bedrock; }
}
PalettedBrush.prototype.toPermutation = PalettedBrush.prototype.next;
BlockPermutation.prototype.toPermutation = function toPermutation(r){return this;}
String.prototype.toPermutation = function toPermutation(r){return BlockPermutation.resolve(this);}