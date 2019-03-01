class Population {

  public population: DNA[] = [];
  public matingPool: DNA[] = [];

  public mutationRate = 0.01;
  public maxSteps: number;
  public size: number;

  constructor(size: number, moves: number) {
    this.maxSteps = moves;
    this.size = size;

    for (let i = 0; i < this.size; i++) {
      this.population.push(new DNA(this.size));
    }
  }

  public update = () => {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].update();
    }
  }

  public show = () => {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].show();
    }
  }

  public checkDead = () => {
    for (let i = 0; i < this.population.length; i++) {
      if (!this.population[i].isDead()) {
        return false;
      }
    }
    return true;
  }

  // Sets max moves to that of the winning Dna
  public findMaxSteps = () => {
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].isOnGoal()) {
        if (this.population[i].getSteps() < this.maxSteps) {
          this.maxSteps = this.population[i].getSteps();
        }
      }
    }
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].setSteps(this.maxSteps);
    }
  }

  public getMaxFitness = () => {
    let maxFitness = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].getFitness() > maxFitness) {
        maxFitness = this.population[i].getFitness();
      }
    return maxFitness;
    }
  }

  // Finds the best of the generation
  //public findChampion = () => {
    // TODO implement
  //}

  // Calculates fitness levels of each DNA obejct
  public calculateFitness = () => {
    this.population.forEach((item) => {
      item.calculateFitness();
    });
  }

  // Generates a mating pool based on the fitness level
  public generateMatingPool = () => {

    let maxFitness = this.getMaxFitness();

    for (let i = 0; i < this.population.length; i++) {

      const fitnessNormal: number = map(this.population[i].getFitness(), 0, maxFitness, 0 , 1);
      const max: number = Math.floor(fitnessNormal * 10); // Arbitrary multiplier

      for (let j = 0; j < max; j++) {
        this.matingPool.push(this.population[i]);
      }
    }
  }

  // Generates a child based on the combined parrents
  public generateChild = () => {
    for (let i = 0; i < this.population.length; i++) {
      let parrentA: DNA = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
      let parrentB : DNA= this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
      let child: DNA = parrentA.breed(parrentB);
      child.mutate(this.mutationRate);
      this.population[i] = child;
    }
  }
}
