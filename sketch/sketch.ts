let population: Population;
let goal: Goal;

let gen: number;
let play: boolean;

let obstacles: Obstacle[];

function setup() {
  createCanvas(800, 800);

  background('white');

  population = new Population(400, 400);
  goal = new Goal();

  gen = 1;
  play = false;
  obstacles = [];
  console.log(population);
  frameRate(800);
}

function draw() {
  // Draws the background every frame
  background(222);

  if (population.checkDead()) {
    population.setMaxSteps();
    population.calculateFitness();
    population.generateMatingPool();
    population.generateChild();
    gen++;

  } else {
    population.move();
    show();
  }

  for (const dna of population.population) {
    const pos = dna.getPosition();
    for (const obs of obstacles) {
      if (obs.isTouching(pos)) {
        dna.setDead(true);
      }
    }
  }
}

function show() {
  // Shows dots
  population.show();

  // Shows generation text
  fill(0);
  text('generation: ' + gen, 10, 20);

  // Shows obstacles
  for (const obs of obstacles) {
      obs.show();
  }

  // Shows goal
  goal.show();
}

function mousePressed() {
  obstacles.push(new Obstacle(mouseX, mouseY));
}

function mouseReleased() {
  obstacles[obstacles.length - 1].setHeight(mouseY);
  obstacles[obstacles.length - 1].setWidth(mouseX);
}
