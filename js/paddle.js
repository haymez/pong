// Code for paddle model

var Paddle = function(nameSpace, id, left, right, color) {
  this.id = id;
  this.left = left;
  this.right = right;
  this.color = color;
  this.moving = false;
  return this;
}