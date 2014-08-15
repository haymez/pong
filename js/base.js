// Hanldes basic operations for pong

var Pong = function(nameSpace) {
  var controls = function(evt) {
    console.log(evt.which);
    var paddle = $('.' + nameSpace + ' #paddle')
    switch(evt.which) {
      case 37:
        paddle.css('left', paddle.offset().left - 20)
        break;
      case 39:
        paddle.css('left', paddle.offset().left + 20)
        break;
    }
  }
  $(document.body).keydown(controls);
}

var pong = new Pong('board');