
// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/

const golden_ratio_conjugate = 0.618033988749895;

export function palette(n = 10, s = 0.6, v = 0.95, h = Math.random()) {


    let colors = [];
    // let h = Math.random();
    for(let i=0;i<n;i++) {
      h = (h + golden_ratio_conjugate) %1;
      colors.push(HSVtoRGB(h, s, v));
    }
    
    return colors;
}

export function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


export const colors = palette(20);
