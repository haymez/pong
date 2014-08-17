// Handles basic operations for pong. 
// Code for game model and rules

var Pong = function(nameSpace, paddles, balls) {

  var movePaddle = function(paddle, y) {
    var newPosition = paddle.position().top + y
    var height = Number($('.' + nameSpace).css('height').replace('px', ''));
    console.log(newPosition, height)
    if(newPosition > 0 && newPosition < height*.8) paddle.css('top', newPosition);
  }

  var handleKeyPress = function(evt) {
    if(evt.which != 116) evt.preventDefault(); //Prevent default events unless f5 is pressed

    if(evt.which === 32) {
      launchBall();
      return;
    }

    var paddleObj = paddles.find(function(n) {
      return n.up === evt.which || n.down === evt.which;
    });

    if(!paddleObj || !!paddleObj.moving) return;

    var y = 0
    if(paddleObj.up === evt.which) y = -8;
    else y = 8;

    paddleObj.moving = setInterval(function() { movePaddle($('#' + paddleObj.id), y); }, 10)
  }
  var stopMoving = function(evt) {
    var paddleObj = paddles.find(function(n) {
      return n.up === evt.which || n.down === evt.which;
    });
    if(!paddleObj) return;

    clearInterval(paddleObj.moving);
    paddleObj.moving = false;
  }

  // Change the direction of a ball
  changeDirection = function(ballObj, yDirection) {
    if(yDirection) ballObj.direction *= -1;
    else {
      ballObj.direction = 180 - ballObj.direction;
    }
  }

  // Handles collisions
  var handleCollisions = function(ballObj) {
    var board = $('.' + nameSpace);
    var boardHeight = Number(board.css('height').replace('px', ''));
    var boardWidth = Number(board.css('width').replace('px', ''));
    var x = ballObj.position.x;
    var y = ballObj.position.y;
    if(y <= 0) {
      changeDirection(ballObj, true);
    }
    else if(y >= boardHeight - 20) {
      changeDirection(ballObj, true);
    }
    else if(x >= boardWidth - 20) {
      changeDirection(ballObj, false);
    }
    else if (x <= 0) {
      changeDirection(ballObj, false);
    }
  }

  var moveBall = function(ballObj) {
    // Get distances for x and y
    var radians = ballObj.direction * Math.PI / 180;
    var x = ballObj.speed * Math.cos(radians);
    var y = ballObj.speed * Math.sin(radians);

    // Round to two decimals
    x = Math.round(x*100)/100;
    y = Math.round(y*100)/100;

    // Move ball
    var ball = $('#' + ballObj.id);
    ball.css('left', ball.position().left + x);
    ball.css('top', ball.position().top - y);

    // Update ball position
    ballObj.position = {
      x: Math.round(Number(ball.css('left').replace('px', '')) * 100) / 100,
      y: Math.round(Number(ball.css('top').replace('px', '')) * 100) / 100
    }

    handleCollisions(ballObj);
  }

  var insertBall = function(ball) {
    var element = document.createElement('div');
    element.id = ball.id;
    element.className = 'ball';
    element.style.backgroundColor = ball.color;
    $('.' + nameSpace).append(element);
    var ballEl = $('#' + ball.id);
    ballEl.css('left', ball.position.x);
    ballEl.css('top', ball.position.y);
  }

  var launchBall = function() {
    var ball = balls.find(function(n) { return !n.launched });
    if(!ball) {
      clearInterval(balls[0].launched);
      balls[0].launched = false;
      return;
    }
    insertBall(ball);
    ball.launched = setInterval(function() { moveBall(ball) }, 10)
    console.log('Launched:', ball);
  }

  var insertPaddle = function(paddle) {
    var element = document.createElement('div');
    element.id = paddle.id;
    element.className = 'paddle';
    element.style.backgroundColor = paddle.color;
    if(paddle.leftSide) element.style.left = '10px';
    else element.style.right = '10px';
    $('.' + nameSpace).append(element);
  }
  paddles.each(insertPaddle);  

  $(document.body).on('keydown', handleKeyPress);
  $(document.body).on('keyup', stopMoving);
}

var paddle = new Paddle('paddle1', 87, 83, 'blue', true);
var paddle2 = new Paddle('paddle2', 38, 40, 'red', false);

var ball = new Ball('ball1', 35, 5, {x: 400, y: 150}, 'black');

var pong = new Pong('board', [paddle, paddle2], [ball]);