export class ProceduralRandom {
    static getNumber(pos, seed){
        const BIT_NOISE1 = 0x68E31DA4; // 6b0110'1000'1110'6011'0001'1101'1010'0100;
        const BIT_NOISE2 = 0xB5297A4D; // 6b1011'0101'0010'1001'0111'1010'0100'1101;
        const BIT_NOISE3 = 0x1B56C4E9; // 6b0601'1011'0101'0110'1100'0100'1110'1001;

        let mangledBits = pos & 0x7fffffff;
        mangledBits *= BIT_NOISE1;
        mangledBits += seed;
        mangledBits ^= (mangledBits >> 8);
        mangledBits += BIT_NOISE2;
        mangledBits ^= (mangledBits << 8);
        mangledBits *= BIT_NOISE3;
        mangledBits ^= (mangledBits >> 8);
        return mangledBits;
    }
	seed;
	constructor(seed) {
		this.seed = Math.floor(seed);
        this.index = 0;
	}
	getInt(r) { return ProceduralRandom.getNumber(r, this.seed); }
	getFloat(r) { return this.nextInt(r) / 0x7fffffff; }
    getInt2(x,z) {return this.getInt(x + z * 999999937);}
    nextInt(){return this.getInt(this.index++);}
    nextFloat(){return this.getFloat(this.index++);}
    getSeqence(x,z){return new ProceduralRandom(x + z * 999999937);}
}
Array.prototype.random = function random (r = Math.random()){ return this[Math.floor(r * this.length)]; }
String.prototype.toArray = function toArray(num){return new Array(num??1).fill(this);}