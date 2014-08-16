// Code for ball model

var Ball = function(id, direction, speed, position, color) {
  this.id = id;
  this.direction = direction;
  this.speed = speed;
  this.position = { x: position.x, y: position.y };
  this.color = color;
  this.launched = false;
}