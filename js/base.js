// Handles basic operations for pong. 
// Code for game model and rules

var Pong = function(nameSpace, paddles) {

  var movePaddle = function(paddle, x) {
    paddle.css('left', paddle.offset().left + x);
  }

  var handleKeyPress = function(evt) {

    if(evt.which === 32) {
      launch();
      return;
    }

    var paddleObj = paddles.find(function(n) {
      return n.left === evt.which || n.right === evt.which;
    });

    if(!paddleObj || !!paddleObj.down) return;

    var x = 0
    if(paddleObj.left === evt.which) x = -8;
    else x = 8;

    paddleObj.down = setInterval(function() { movePaddle($('#' + paddleObj.id), x); }, 10)
  }
  var stopMoving = function(evt) {
    var paddleObj = paddles.find(function(n) {
      return n.left === evt.which || n.right === evt.which;
    });
    if(!paddleObj) return;

    clearInterval(paddleObj.down);
    paddleObj.down = false;
  }

  var launch = function() {
    console.log('launch');
  }

  var insertPaddles = function(paddle) {
    var element = document.createElement('div');
    element.id = paddle.id;
    element.className = 'paddle';
    element.style.backgroundColor = paddle.color;
    $('.' + nameSpace).append(element);
  }.bind(this)
  paddles.each(insertPaddles);  

  $(document.body).on('keydown', handleKeyPress);
  $(document.body).on('keyup', stopMoving);
}

var paddle = new Paddle('board', 'paddle1', 65, 68, 'blue');
var paddle2 = new Paddle('board', 'paddle2', 37, 39, 'red');
var pong = new Pong('board', [paddle, paddle2]);