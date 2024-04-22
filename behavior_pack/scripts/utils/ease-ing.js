export function proximityEaseing(x, proximityFactor) { return 1 / (1 + Math.exp(-proximityFactor * (x - 0.5))); }
// SINE
export function easeInSine(x) { return 1 - Math.cos((x * Math.PI) / 2); }
export function easeOutSine(x) { return Math.sin((x * Math.PI) / 2); }
export function easeInOutSine(x) { return -(Math.cos(Math.PI * x) - 1) / 2; }
// QAUD
export function easeInQuad(x) { return x * x; }
export function easeOutQuad(x) { return 1 - (1 - x) * (1 - x); }
export function easeInOutQuad(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
// CUBIC
export function easeInCubic(x) { return x * x * x; }
export function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); } 
export function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
// QUART
export function easeInQuart(x) { return x * x * x * x; }
export function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }
export function easeInOutQuart(x) { return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; }

export function easeInQuint(x) { return x * x * x * x * x; }
export function easeOutQuint(x) { return 1 - Math.pow(1 - x, 5); }
export function easeInOutQuint(x) { return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2; }

export function easeInExpo(x) { return x === 0 ? 0 : Math.pow(2, 10 * x - 10); }
export function easeOutExpo(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);}
export function easeInOutExpo(x) { return x === 0 ? 0 : x === 1? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2; }

export function easeInCirc(x) { return 1 - Math.sqrt(1 - Math.pow(x, 2)); }
export function easeOutCirc(x) { return Math.sqrt(1 - Math.pow(x - 1, 2)); }
export function easeInOutCirc(x) { return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2; }

const c1 = 1.70158, c2 = c1 * 1.525, c3 = c1 + 1;
export function easeInBack(x) { return c3 * x * x * x - c1 * x * x; }
export function easeOutBack(x) { return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
export function easeInOutBack(x) { return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2; }

export function easeInElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
        ? 0
        : x === 1
        ? 1
        : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
}
export function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
export function easeInOutElastic(x) {
    const c5 = (2 * Math.PI) / 4.5;
    return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

export function easeInBounce(x) { return 1 - easeOutBounce(1 - x); }
export function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}
export function easeInOutBounce(x) {
    return x < 0.5
        ? (1 - easeOutBounce(1 - 2 * x)) / 2
        : (1 + easeOutBounce(2 * x - 1)) / 2;
}