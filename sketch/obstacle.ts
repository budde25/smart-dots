class Obstacle {

  private position: p5.Vector;
  private obsWidth: number;
  private obsHeight: number;

  constructor(posx: number, posy: number , obsWidth: number, obsHeight: number) {
    this.position = createVector(posx, posy);
    this.obsWidth = obsWidth;
    this.obsHeight = obsHeight;
  }

 public show = () => {
   fill(127);
   rect(this.position.x, this.position.y, this.obsWidth, this.obsHeight);
 }

 public isTouching = (location: p5.Vector): boolean => {
  return location.x > this.position.x &&
    location.x < this.position.x + this.obsWidth &&
    location.y > this.position.y &&
    location.y < this.position.y + this.obsHeight;
 }
}
