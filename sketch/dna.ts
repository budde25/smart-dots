function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

class DNA {

  private colors: p5.Color[] = [color('red'), color('green'), color('blue'), color('yellow')];

  //private goal: Goal;

  private size: number;
  private radius: number;
  private color: p5.Color;

  private position: p5.Vector;
  private velocity: p5.Vector;
  private acceleration: p5.Vector;

  private genes: p5.Vector[];
  private dead: boolean;
  private onGoal: boolean;
  private fitness: number;
  private steps: number;

  constructor(size: number) {

    this.size = size;
    this.radius = 8;
    this.color = this.colors[getRandomInt(0, this.colors.length)];

    this.position = createVector(width / 2, height - 20);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    this.dead = false;
    this.onGoal = false;
    this.fitness = 0;
    this.steps = 0;

    this.genes = [];
    for (let i = 0; i < this.size; i++) {
      this.genes[i]  = p5.Vector.random2D();
   }
  }

  public isDead = () => this.dead;
  public getPosition = () => this.position;
  public getFitness = () => this.fitness;
  public getSteps = () => this.steps;
  public isOnGoal = () => this.onGoal;
  public getColor = () => this.color;

  public setDead = (dead: boolean) => this.dead = dead;
  public setSteps = (steps: number) => this.steps = steps;
  public setColor = (color: p5.Color) => this.color = color;

  /**
   * If DNA is still alive checks to see if it should be dead
   */
  public checkDead = () => {
    if (!this.dead) {

      // Checks to see if its hit a wall or if it ran out of moves
      if ((this.position.x < 3 || this.position.x > width - 3 || this.position.y < 3 || this.position.y > height - 3) ||
      (this.genes.length <= this.steps)) {
        this.dead = true;
      }

      // Checks to see if it hit the goal
      if (dist(this.position.x, this.position.y, goal.getPosition().x, goal.getPosition().y) < goal.getRadius()) {
        this.onGoal = true;
        this.dead = true;
      }
    }
  }

  /**
   * Draws the DNA
   */
  public show = () => {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
  }

  /**
   * Moves the DNA
   */
  public move = () => {
    this.checkDead();
    if (!this.dead) {
        this.acceleration = this.genes[this.steps];
        this.velocity.add(this.acceleration).limit(4.5);
        this.position.add(this.velocity);
        this.steps++;
    }
  }

  /**
   * Calculates the fitness of the DNA
   */
  public calculateFitness = () => {
    const distanceToGoal = dist(this.position.x, this.position.y, goal.getPosition().x, goal.getPosition().y);
    this.fitness = 1 / (distanceToGoal * distanceToGoal);
    if (this.onGoal) {
      this.fitness = this.fitness + (this.fitness / (this.steps));
    }
  }

  /**
   * Breeds the DNA with another
   */
  public breed = (parrentB: DNA) => {
    const child: DNA = new DNA(this.size);

    for (let i = 0; i < this.genes.length; i++) {
      if ( i % 2 === 1) {
        child.genes[i] = this.genes[i];
      } else {
        child.genes[i] = parrentB.genes[i];
      }
    }
    child.setColor(lerpColor(this.color, parrentB.color, Math.random()));
    return child;
  }

  /**
   * makes an identical copy of the DNA
   */
  public clone = () => {
    const child: DNA = new DNA(this.size);

    for (let i = 0; i < this.genes.length; i++) {
      child.genes[i] = this.genes[i];
    }

    return child;
  }

  /**
   * Mutates the child DNA
   */
  public mutate = (mutationRate: number) => {
    for (let i = 0; i < this.genes.length; i++) {
      if (random() < mutationRate) {
        this.genes[i] = p5.Vector.random2D();
      }
    }
  }
}
