// Handles basic operations for pong. 
// Code for game model and rules

var Pong = function(nameSpace, paddles, balls) {
  var leftSidePoints = 0;
  var rightSidePoints = 0;
  var movePaddle = function(paddleObj, y) {
    var paddle = $('#' + paddleObj.id);
    var height = Number($('.' + nameSpace).css('height').replace('px', ''));
    var newPosition = paddleObj.y + y;
    if(newPosition < height*.8) {
      if(newPosition > 0) {
        paddle.css('top', newPosition);
        paddleObj.y = newPosition;
      } else {
        paddle.css('top', 0);
        paddleObj.y = 0;
      }
    }
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

    paddleObj.moving = setInterval(function() { movePaddle(paddleObj, y); }, 10)
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

  var overlapping = function(ballObj) {
    var collision = false;
    var ballX = ballObj.position.x;
    var ballY = ballObj.position.y;
    var board = $('.' + nameSpace);
    var boardWidth = Number(board.css('width').replace('px', ''));
    var boardHeight = Number(board.css('height').replace('px', ''));
    var paddleWidth = boardWidth * .02;
    var paddleHeight = boardHeight * .2;

    var overlap = function(paddleObj) {
      var paddle = $('#' + paddleObj.id);
      var leftSide;
      if(!paddleObj.leftSide) leftSide = paddle.position().left - paddleWidth;
      else leftSide = paddle.position().left;
      var topSide = paddle.position().top;
      if(ballX >= leftSide && ballX <= leftSide+paddleWidth) {
        if(ballY >= topSide && ballY <= topSide + paddleHeight) {
          collision = true;
          ballObj.speed += .2;
          return false; // Break out of loop
        }
      }
    }

    paddles.each(overlap);
    return collision;
  }

  var score = function(side, ballObj) {
    var scoreboard = $('#' + side);
    console.log(side);
    if(side === 'left') {
      leftSidePoints++;
      scoreboard.html(leftSidePoints);
    } else {
      rightSidePoints++;
      scoreboard.html(rightSidePoints);
    }
    $('#' + ballObj.id).remove();
    clearInterval(ballObj.launched);
    ballObj.launched = false;
    ballObj.position = {x: 250, y: 250};
    ballObj.speed = 5;
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
      score('left', ballObj);
      // changeDirection(ballObj, false);
    }
    else if (x <= 0) {
      score('right', ballObj);
      // changeDirection(ballObj, false);
    }
    else if(overlapping(ballObj)) {
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
    element.style.top = paddle.y + 'px';
    $('.' + nameSpace).append(element);
  }
  paddles.each(insertPaddle);  

  $(document.body).on('keydown', handleKeyPress);
  $(document.body).on('keyup', stopMoving);
}

var paddle = new Paddle('paddle1', 87, 83, 'red', true, 10);
var paddle2 = new Paddle('paddle2', 38, 40, 'blue', false, 150);

var ball = new Ball('ball1', 35, 5, {x: 400, y: 150}, 'black');
var ball2 = new Ball('ball2', 127, 5, {x: 600, y: 150}, 'yellow');
var ball3 = new Ball('ball3', 165, 5, {x: 600, y: 350}, 'orange');

var pong = new Pong('board', [paddle, paddle2], [ball, ball2, ball3]);