let inc = 0.1;
let z = 0;
let gens = [];

function setup() {
  createCanvas(600, 600);
  background(255);
}

function draw() {
  z += 0.002;
  for (let g of gens) {
    g.addParts();
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

  addParts() {
    for (let i = 0; i < 3; i++) {
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
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.fade = 255;
  }

  flow() {
    let angle = noise(this.pos.x * inc, this.pos.y * inc, z) * TWO_PI * 4;
    let dir = p5.Vector.fromAngle(angle).setMag(0.5);
    this.acc.add(dir);
  }

  move() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.fade -= 1.2;
  }

  show() {
    stroke(0, this.fade);
    strokeWeight(0.7);
    point(this.pos.x, this.pos.y);
  }
}
