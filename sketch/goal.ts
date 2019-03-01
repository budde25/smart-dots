class Goal {
  private position: p5.Vector;
  private radius: number;

  constructor() {
    this.position = createVector(width / 2, 5);
    this.radius = 10;
  }

  public getPosition = () => this.position;
  public getRadius = () => this.radius;

  public show = () => {
    fill(127);
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
  }
}
