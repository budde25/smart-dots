class Population {

  public population: DNA[] = [];
  public matingPool: DNA[] = [];

  // Default muation rate is 0.01
  public mutationRate = 0.01;
  public moves: number;
  public size: number;

  constructor(size: number, moves: number) {
    this.moves = moves;
    this.size = size;

    // Fills array with new DNA
    for (let i = 0; i < this.size; i++) {
      this.population.push(new DNA(this.moves));
    }
  }

  /**
   * Runs update function on the entire poplution
   */
  public move = () => { for (const pop of this.population) { pop.move(); }};

  /**
   * Runs show function on the entire population
   */
  public show = () => { for (const pop of this.population) { pop.show(); }};

  /**
   * checks to see is alive or dead
   * returns true if all dead, false otherwise
   */
  public checkDead = (): boolean => {
    for (const pop of this.population) {
    if (!pop.isDead()) {
      return false;
      }
    }
    return true;
  }

  /**
   * Sets max moves to that of the winning Dna
   */
  public setMaxSteps = () => {

    let maxSteps = this.moves;

    // Gets the steps of the best dot the touches the goal
    for (const pop of this.population) {
      if (pop.isOnGoal() && pop.getSteps() < maxSteps) {
        maxSteps = pop.getSteps();
      }
    }

    // Sets the max steps for the entire population
    for (const pop of this.population) {
      pop.setSteps(maxSteps);
    }
  }

  /**
   *  Finds the best fitness in the population
   *  returns the best fitness number
   */
  public getMaxFitness = (): number => {
    let maxFitness = 0;

    for (const pop of this.population) {
      if (pop.getFitness() > maxFitness) {
        maxFitness = pop.getFitness();
      }
      return maxFitness;
    }
  }

  /**
   * find the best DNA of the population
   * returns the most fit DNA
   */
  public findChampion = () => {
    let champion = new DNA(this.size);
    for (const pop of this.population) {
      if (pop.getFitness() > champion.getFitness()) {
        champion = pop;
      }
    }

    champion = champion.clone();
    champion.setColor(color('black'));
    return champion;
  }

  /**
   * Calculates the fitness of each DNA in the population
   */
  public calculateFitness = () => { for (const pop of this.population) { pop.calculateFitness(); }};

  /**
   * Generates a mating pool based on the fitness level
   */
  public generateMatingPool = () => {

    const maxFitness = this.getMaxFitness();

    for (const pop of this.population) {

      const fitnessNormal: number = map(pop.getFitness(), 0, maxFitness, 0 , 1);
      const max: number = Math.floor(fitnessNormal * 10); // Arbitrary multiplier

      for (let j = 0; j < max; j++) {
        this.matingPool.push(pop);
      }
    }
  }

  /**
   * Generates the children and the champion and add them to the population
   */
  public generateChild = () => {
    this.population[0] = this.findChampion();

    for (let i = 1; i < this.population.length; i++) {
      const parrentA: DNA = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
      const parrentB: DNA = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
      const child: DNA = parrentA.breed(parrentB);
      child.mutate(this.mutationRate);
      this.population[i] = child;
    }
  }
}
