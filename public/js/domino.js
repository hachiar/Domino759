var game = {
  xhtmlns: 'http://www.w3.org/1999/xhtml',
  svgns: 'http://www.w3.org/2000/svg',
  BOARDX: 50, //starting pos of board
  BOARDY: 50,
  game_id: '',
  j: 3, //look above
  boardArr: new Array(), //2d array [row][col]
  pieceArr: new Array(), //2d array [player][piece] (player is either 0 or 1)
  BOARDWIDTH: 14, //how many squares across
  BOARDHEIGHT: 7, //how many squares down
  CELLSIZE: 80,
  THISPLAYER: $('#pid').attr('value'),
  moves: '',
  init: function() {
    //create a parent to stick board in...

    // console.log(gameexist);
    // if (gameexist) {
    //   return;
    // }

    //console.log(user_id + message);
    var oppo_id = $('#opponent_id').attr('value');
    var path = './load/' + oppo_id;
    myXHR(path, 'GET', '').done(function(res) {
      if (res.moveData) {
        loadGame(res, oppo_id);
      } else {
        initNewGame(game.THISPLAYER, oppo_id);
      }
    });

    //  }
    //put the drop code on the document...
    document
      .getElementsByTagName('svg')[0]
      .addEventListener('mouseup', drag.releaseMove, false);
    //put the go() method on the svg doc.
    document
      .getElementsByTagName('svg')[0]
      .addEventListener('mousemove', drag.go, false);
  }
};

///////////////////////Dragging code/////////////////////////
var drag = {
  //the problem of dragging....
  myX: '', //hold my last pos.
  myY: '', //hold my last pos.
  mover: '', //hold the id of the thing I'm moving
  ////setMove/////
  //	set the id of the thing I'm moving...
  ////////////////
  setMove: function(which) {
    drag.mover = which;
    //get the last position of the thing... (NOW through the transform=translate(x,y))
    xy = util.getTransform(which);

    drag.myX = xy[0];
    drag.myY = xy[1];
    //get the object then re-append it to the document so it is on top!
    util.getPiece(which).putOnTop(which);
  },

  ////releaseMove/////
  //	clear the id of the thing I'm moving...
  ////////////////
  releaseMove: function(evt) {
    if (drag.mover != '') {
      //is it YOUR turn?
      if (turn == playerId) {
        var hit = drag.checkHit(evt.layerX, evt.layerY, drag.mover);
      } else {
        var hit = false;
        util.nytwarning();
      }
      if (hit == true) {
        //I'm on the square...
        //send the move to the server!!!
      } else {
        //move back
        util.setTransform(drag.mover, drag.myX, drag.myY);
      }
      drag.mover = '';
    }
  },

  ////go/////
  //	move the thing I'm moving...
  ////////////////
  // go: function(evt) {
  //   console.log('Inside Go');
  //   if (drag.mover != '') {
  //     util.setTransform(drag.mover, evt.layerX, evt.layerY);
  //   }
  // },

  ////checkHit/////
  //	did I land on anything important...
  ////////////////
  checkHit: function(x, y, id) {
    //lets change the x and y coords (mouse) to match the transform
    x = x - game.BOARDX;
    y = y - game.BOARDY;
    //go through ALL of the board
    for (i = 0; i < game.BOARDWIDTH; i++) {
      for (j = 0; j < game.BOARDHEIGHT; j++) {
        var drop = game.boardArr[i][j].myBBox;
        //document.getElementById('output2').firstChild.nodeValue+=x +":"+drop.x+"|";
        if (
          x > drop.x &&
          x < drop.x + drop.width &&
          y > drop.y &&
          y < drop.y + drop.height &&
          game.boardArr[i][j].droppable &&
          game.boardArr[i][j].occupied == ''
        ) {
          //NEED - check is it a legal move???
          //if it is - then
          //put me to the center....
          util.setTransform(
            id,
            game.boardArr[i][j].getCenterX(),
            game.boardArr[i][j].getCenterY()
          );
          //fill the new cell
          //alert(parseInt(which.substring((which.search(/\|/)+1),which.length)));
          util.getPiece(id).changeCell(game.boardArr[i][j].id, i, j);
          //////////////////
          //change the board in the database for the other person to know

          //change who's turn it is
          util.changeTurn();
          return true;
        }
      }
    }
    return false;
  }
};
game.init();
console.log($('#opponent_id').attr('value'));

var gameOn = setInterval(function() {
  var oppo_id = $('#opponent_id').attr('value');
  var path = './load/' + oppo_id;
  myXHR(path, 'GET', { game_id: game.game_id }).done(function(res) {
    console.log(res);
    if (res.moveData) {
      $('svg').empty();
      loadGame(res, oppo_id);
    } else if (res.results) {
      gameOver(res);
      clearInterval(gameOn);
    }
  });
}, 5000);
