let inc = 0.05;
let z = 0;
let gens = [];

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 255);
  background(255);
}

function draw() {
  z += 0.002;
  for (let g of gens) {
    g.addParticles();
    g.update();
  }
}

function mousePressed() {
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
