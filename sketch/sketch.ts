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
}

function draw() {
  background(222);

  if (population.checkDead()) {
    population.findMaxSteps();
    population.calculateFitness();
    population.generateMatingPool();
    population.generateChild();
    gen++;

  } else {
    population.update();
    population.show();
    goal.show();
  }

  for (let i = 0; i < population.population.length; i++) {
    let pos = population.population[i].getPosition();
    for (let j = 0; j < obstacles.length; j++) {
      if(obstacles[j].isTouching(pos)) {
        population.population[i].setDead(true);
      }
    }
  }

  fill(0);
  text('generation: ' + gen, 10, 20);

  for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].show();
  }

}

function mousePressed() {
  obstacles.push(new Obstacle(mouseX, mouseY, 300, 10));
}