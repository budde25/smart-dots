class Obstacle {

  private position: p5.Vector;
  private obsWidth: number;
  private obsHeight: number;

  constructor(posx: number, posy: number) {
    this.position = createVector(posx, posy);
    this.obsWidth = null;
    this.obsHeight = null;
  }

  public setWidth = (obsWidth: number) => this.obsWidth = obsWidth;
  public setHeight = (obsHeight: number) => this.obsHeight = obsHeight;

 public show = () => {
   if (this.obsHeight == null && this.obsWidth == null ) {
      fill(127);
      rect(this.position.x, this.position.y, -this.position.x + mouseX, -this.position.y + mouseY);
   } else {
    fill('green');
    rect(this.position.x, this.position.y, -this.position.x + this.obsWidth, -this.position.y + this.obsHeight);
   }
 }

 public isTouching = (location: p5.Vector): boolean => {
  return location.x > this.position.x &&
    location.x < this.position.x + this.obsWidth &&
    location.y > this.position.y &&
    location.y < this.position.y + this.obsHeight;
 }
}
