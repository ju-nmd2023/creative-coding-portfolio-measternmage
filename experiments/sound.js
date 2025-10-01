let inc = 0.05;
let z = 0;
let gens = [];

let piano;
let kick, hihat;
let toneReady = false;

const chords = [
  ["C4", "Eb4", "G4"],
  ["F4", "Ab4", "C5"],
  ["G4", "Bb4", "D5"],
  ["Ab4", "C5", "Eb5"]
];
let chordStep = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 255);
  background(255);
  initMusic();
}

function draw() {
  z += 0.002;
  for (let g of gens) {
    g.addParticles();
    g.update();
  }
}

async function initMusic() {
  await Tone.start();
  toneReady = true;

  piano = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.8, decay: 0.5, sustain: 0.3, release: 2.5 }
  }).toDestination();
  piano.volume.value = -10;

  kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.5 }
  }).toDestination();

  hihat = new Tone.MetalSynth({
    frequency: 400,
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).toDestination();

  new Tone.Loop(time => kick.triggerAttackRelease("C2", "8n", time), "1n").start(0);
  new Tone.Loop(time => hihat.triggerAttackRelease("16n", time), "0.5n").start(0);

  Tone.Transport.bpm.value = 100;
  Tone.Transport.start();
}

function mousePressed() {
  if (!toneReady) return;

  piano.triggerAttackRelease(chords[chordStep], "2n");
  chordStep = (chordStep + 1) % chords.length;

  gens.push(new Gen(mouseX, mouseY));
}

class Gen {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.parts = [];
  }

  addParticles() {
    for (let i = 0; i < 4; i++) {
      this.parts.push(new Part(this.pos.x, this.pos.y));
    }
  }

  update() {
    for (let p of this.parts) {
      p.flow();
      p.move();
      p.show();
    }
    this.parts = this.parts.filter(p => p.fade > 0);
  }
}

class Part {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prev = this.pos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.fade = 200;
    this.hue = random(255);
  }

  flow() {
    let angle = noise(this.pos.x * inc, this.pos.y * inc, z) * TWO_PI * 4;
    let dir = p5.Vector.fromAngle(angle).setMag(0.5);
    this.acc.add(dir);
  }

  move() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.prev.set(this.pos.x, this.pos.y);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.fade -= 1;
  }

  show() {
    stroke(this.hue, 200, 255, this.fade);
    strokeWeight(0.5);
    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
  }
}
