


const ctx = new AudioContext();
const gain = ctx.createGain();
let audiobuffer= null;

gain.connect(ctx.destination)


