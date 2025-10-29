

const ctx = new AudioContext();
const gain = new GainNode(ctx);
let audiobuffer = null, sourceNode= null;
gain.connect(ctx.destination)
