// Code for paddle model

var Paddle = function(id, up, down, color, leftSide, y) {
  this.id = id;
  this.up = up;
  this.down = down;
  this.color = color;
  this.leftSide = leftSide;
  this.moving = false;
  this.y = y;
  return this;
}