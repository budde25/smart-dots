class Obstacle {

  private position: p5.Vector;
  private obsWidth: number;
  private obsHeight: number;

  constructor(posx: number, posy: number) {
    this.position = createVector(posx, posy);
    this.obsWidth = null;
    this.obsHeight = null;
  }

  public setWidth = (X: number) => this.obsWidth = Math.abs(-this.position.x + X);
  public setHeight = (Y: number) => this.obsHeight = Math.abs(-this.position.y + Y);

 public show = () => {
   if (this.obsHeight == null && this.obsWidth == null ) {
      fill(169, 169, 169, 200);
      rect(this.position.x, this.position.y, -this.position.x + mouseX, -this.position.y + mouseY);
   } else {
    fill(169, 169, 169);
    rect(this.position.x, this.position.y, this.obsWidth, this.obsHeight);
   }
 }

 public isTouching = (location: p5.Vector): boolean => {
  if (this.obsWidth != null && this.obsHeight != null) {
    return location.x > this.position.x &&
      location.x < this.position.x + this.obsWidth &&
      location.y > this.position.y &&
      location.y < this.position.y + this.obsHeight;
    } else {
      return false;
    }
  }
}
