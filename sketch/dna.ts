class DNA {

  private goal: Goal;

  private size: number;
  private radius: number;

  private position: p5.Vector;
  private velocity: p5.Vector;
  private acceleration: p5.Vector;

  private genes: p5.Vector[];
  private dead: boolean;
  private onGoal: boolean;
  private fitness: number;
  private steps: number;

  constructor(size: number) {

    this.goal = new Goal();

    this.size = size;
    this.radius = 4;

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

  public setDead = (dead: boolean) => this.dead = dead;
  public setSteps = (steps: number) => this.steps = steps;

  public checkDead = () => {
    if (!this.dead) {
      if (this.genes.length < this.steps) {
        // this.dead = true;
      }
      if (this.position.x < 3 || this.position.x > width - 3 || this.position.y < 3 || this.position.y > height - 3) {
        this.dead = true;
      }
      if (dist(this.position.x, this.position.y, this.goal.getPosition().x, this.goal.getPosition().y) < this.goal.getRadius()) {
        this.onGoal = true;
        this.dead = true;
      }
    }
  }

  public show = () => {
    fill(0);
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
  }

  public update = () => {
    this.checkDead();
    if (!this.dead) {
        if (this.genes.length > this.steps) {
          this.acceleration = this.genes[this.steps];
        } else {
          this.dead = true;
        }
        this.velocity.add(this.acceleration);
        this.velocity.limit(5);
        this.position.add(this.velocity);
        this.steps++;
    }
  }

  public calculateFitness = () => {
    const distanceToGoal = dist(this.position.x, this.position.y, this.goal.getPosition().x, this.goal.getPosition().y);
    this.fitness = 1 / (distanceToGoal * distanceToGoal);
    this.fitness = this.fitness / (this.steps);
  }

  public breed = (parrentB: any) => {
    const child = new DNA(this.genes.length);

    for (let i = 0; i < this.genes.length; i++) {
      if ( i % 2 === 1) {
        child.genes[i] = this.genes[i];
      } else {
        child.genes[i] = parrentB.genes[i];
      }
    }
    return child;
  }

  public mutate = (mutationRate: number) => {
    for (let i = 0; i < this.genes.length; i++) {
      if (random() < mutationRate) {
        this.genes[i] = p5.Vector.random2D();
      }
    }
  }
}
