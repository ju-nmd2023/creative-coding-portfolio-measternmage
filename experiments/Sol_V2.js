let canvasSize = 700;

function setup() {
  createCanvas(canvasSize, canvasSize);
  rectMode(CORNER);
}

function draw() {
  background(255);

  const edge = 60;
  const outerBox = width - edge * 2;

  stroke(0);
  strokeWeight(3);
  noFill();
  rect(edge, edge, outerBox, outerBox);

  const space = 12;
  const innerBox = (outerBox - space) / 2;

  const squares = [
    [edge, edge, 'upDown'],
    [edge + innerBox + space, edge, 'leftRight'],
    [edge, edge + innerBox + space, 'slash'],
    [edge + innerBox + space, edge + innerBox + space, 'backslash']
  ];

  squares.forEach(([xPos, yPos, style]) => {
    push();

    fill(random(50, 255), random(50, 255), random(50, 255), 150);
    stroke(random(50, 200));
    strokeWeight(random(1, 3));

    const ctx = drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.rect(xPos, yPos, innerBox, innerBox);
    ctx.clip();

    const step = random(10, 20);
    for (let t = -innerBox; t <= innerBox; t += step) {
      let wiggle = noise(t * 0.02) * 15;
      if (style === 'upDown') line(xPos + t, yPos + wiggle, xPos + t, yPos + innerBox + wiggle);
      else if (style === 'leftRight') line(xPos + wiggle, yPos + t, xPos + innerBox + wiggle, yPos + t);
      else if (style === 'backslash') line(xPos + t + wiggle, yPos, xPos + t + innerBox + wiggle, yPos + innerBox);
      else if (style === 'slash') line(xPos + t + wiggle, yPos + innerBox, xPos + t + innerBox + wiggle, yPos);
    }

    ctx.restore();

    stroke(0);
    strokeWeight(2);
    rect(xPos, yPos, innerBox, innerBox);
    pop();
  });
}
