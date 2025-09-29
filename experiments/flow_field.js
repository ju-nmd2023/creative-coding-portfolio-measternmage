let step = 0.1;
let depth = 0;
let movers = [];

function setup() {
  createCanvas(600, 600);
  background(255);
}

function draw() {
  depth += 0.002;
  for (let m of movers) {
    m.flow();
    m.move();
    m.show();
  }
}

function mousePressed() {
  for (let i = 0; i < 5; i++) {
    movers.push(new Mover(mouseX, mouseY));
  }
}

class Mover {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.fade = 255;
  }

  flow() {
    let angle = noise(this.pos.x * step, this.pos.y * step, depth) * TWO_PI * 4;
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
