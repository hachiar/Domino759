//////////////////////////////////////////////////////
// Class: Piece										//
// Description: Using the javascript prototype, you //
// can make faux classes. This allows objects to be //
// made which act like classes and can be referenced//
// by the game.										//
//////////////////////////////////////////////////////
// Piece constructor
// creates and initializes each Piece object
function Piece(board, player, cellRow, cellCol, type, num, text, pid) {
  this.board = board; // piece needs to know the svg board object so that it can be attached to it.
  this.player = player; // piece needs to know what player it belongs to.
  this.type = type; // piece needs to know what type of piece it is. (put in so it could be something besides a checker!)
  this.current_cell = game.boardArr[cellRow][cellCol]; // piece needs to know what its current cell/location is.
  //var loc = console.log(this.current_cell);
  this.number = num; // piece needs to know what number piece it is.
  this.isCaptured = false; // a boolean to know whether the piece has been captured yet or not.
  this.text = text;
  this.player_id = pid;
  //console.log('This is my array value' + typeof this.text);

  //id looks like 'piece_0|3' - for player 0, the third piece
  //this.id = 'piece_' + this.player + '|' + this.text; // the piece also needs to know what it's id is.
  this.id = this.player + ',' + this.number + ',' + this.text;

  this.current_cell.isOccupied(this.id); //set THIS board cell to occupied
  this.x = this.current_cell.getCenterX(); // the piece needs to know what its x location value is.
  this.y = this.current_cell.getCenterY(); // the piece needs to know what its y location value is as well.

  //this.object = eval("new " + type + "(this)");	//eval I wrote in class because I was lazy - better on next line
  this.object = new window[type](this); // based on the piece type, you need to create the more specific piece object (Checker, Pawn, Rook, etc.)
  this.piece = this.object.piece; // a shortcut to the actual svg piece object
  this.setAtt('id', this.id); // make sure the SVG object has the correct id value (make sure it can be dragged)
  if (this.player === pid) {
    // this.piece.addEventListener(
    //   'mousedown',
    //   function() {
    //     //drag.setMove(this.id);
    //     ///console.log(this.);
    //   }
    this.piece.addEventListener(
      'mousedown',
      function(e) {
        var ids = this.id.split(',');
        var sideNum = ids[2].split(' | ');

        var allowedPiecesLeft = game.moves.left.pieces;
        var allowedPiecesRight = game.moves.right.pieces;
        // $('#pieceL').html(allowedPiecesLeft);
        // $('#pieceL').html(allowedPiecesRight);
        if (game.moves.turn != game.moves.my_id) {
          alert('Wait for your turn ;)');
          return;
        }
        if (
          allowedPiecesRight !== sideNum[1] &&
          allowedPiecesLeft !== sideNum[0] &&
          allowedPiecesRight !== sideNum[0] &&
          allowedPiecesLeft !== sideNum[1]
        ) {
          return;
        }

        var newAllowed = null;
        var move = '';
        if (
          allowedPiecesLeft == sideNum[0] ||
          allowedPiecesRight == sideNum[0]
        ) {
          allowedPiecesLeft == sideNum[0] ? (move = 'left') : (move = 'right');
          newAllowed = sideNum[1];
        } else {
          allowedPiecesLeft == sideNum[1] ? (move = 'left') : (move = 'right');
          newAllowed = sideNum[0];
        }

        if (move === 'left') {
          var cellCol = game.moves.left.cells.col;
          var cellRow = game.moves.left.cells.row;
          //console.log(cellRow, cellCol);
          var x = game.boardArr[cellRow][cellCol].x;
          var y = game.boardArr[cellRow][cellCol].y;
          //game.moves.left.cells.row--;
          //game.moves.right.cells.row++;
          //console.log('this is x - y', x, y);

          var myPiece = document.getElementById(this.id);
          myPiece.setAttributeNS(
            null,
            'transform',
            'translate(' + (x + 60) + ',' + (y + 55) + ')'
          );
          //  console.log(this.id + 'kldfkldfk');
          //var newAllowed = game.moves.left.cells.row;
          /*********************************************************************************/

          var thisPiece = this.id;
          var path = './store';
          var cell_id = 'cell_' + cellCol + '' + cellRow;
          var gameexist = $('#game_id').attr('value');
          var newDirection = 'left';

          console.log(game.moves.left.cells);
          movePiece(
            path,
            gameexist,
            newDirection,
            newAllowed,
            cell_id,
            thisPiece
          );

          // myXHR(path, 'POST', {
          //   game_id: gameexist,
          //   direction: newDirection,
          //   updateAllowed: newAllowed,
          //   updateCell: cell_id,
          //   pieceId: thisPiece
          // }).done(function(res) {
          //   console.log(res);
          //   //$('#game_id').attr('value', res.game);
          // });
          /**********************************************************************************/
          // myPiece.lastChild.innerHTML = newText;
          flipTile(myPiece, sideNum);

          //console.log(myPiece.lastChild.innerHTML);
        } else {
          var cellCol = game.moves.right.cells.col;
          var cellRow = game.moves.right.cells.row;
          //console.log(cellRow, cellCol);
          var x = game.boardArr[cellRow][cellCol].x;
          var y = game.boardArr[cellRow][cellCol].y;
          //game.moves.right.cells.row++;
          //game.moves.left.cells.row++;
          //console.log('this is x - y', x, y);

          var myPiece = document.getElementById(this.id);
          myPiece.setAttributeNS(
            null,
            'transform',
            'translate(' + (x + 60) + ',' + (y + 55) + ')'
          );

          /*********************************************************************************/

          var path = './store';
          var gameexist = $('#game_id').attr('value');
          var newDirection = 'right';
          //var newAllowed = game.moves.right.pieces;
          var cell_id = 'cell_' + cellCol + '' + cellRow;
          var thisPiece = this.id;

          //console.log(thisPiece + ' this is piece id');
          movePiece(
            path,
            gameexist,
            newDirection,
            newAllowed,
            cell_id,
            thisPiece
          );

          // myXHR(path, 'POST', {
          //   game_id: gameexist,
          //   direction: newDirection,
          //   updateAllowed: newAllowed,
          //   updateCell: cell_id,
          //   pieceId: thisPiece
          // }).done(function(res) {
          //   console.log(res);
          //   //$('#game_id').attr('value', res.game);
          // });
          /**********************************************************************************/

          //myPiece.lastChild.innerHTML = newText;
          flipTile(myPiece, sideNum);
        }
        // var thisPiece = $(this);
        // console.log('coming from jquery' + thisPiece.attr('id'));
        // thisPiece.unbind('click');
        //$('#' +this.id).off('click');
      },
      false
    );
    // add a mousedown event listener to your piece so that it can be dragged.
  } else {
    this.piece.addEventListener(
      'mousedown',
      function() {
        alert('Hello Not me');
      },
      //'this is not your peice'
      false
    ); //tell the user that isn't his piece!
  }

  //for testing purposes only...
  document.getElementsByTagName('svg')[0].appendChild(this.piece);

  // return this piece object
  return this;
}

Piece.prototype = {
  //change cell (used to move the piece to a new cell and clear the old)
  changeCell: function(newCell, row, col) {
    this.current_cell.notOccupied();
    document.getElementById('output').firstChild.nodeValue =
      'dropped cell: ' + newCell;
    this.current_cell = game.boardArr[row][col];
    this.current_cell.isOccupied(this.id);
    //console.log('changeCell');
  },
  //when called, will remove the piece from the document and then re-append it (put it on top!)
  putOnTop: function() {
    document.getElementsByTagName('svg')[0].removeChild(this.piece);
    document.getElementsByTagName('svg')[0].appendChild(this.piece);
    //  console.log('putOnTop');
  },
  //will record that I'm now a king and change the one on the screen
  kingMe: function(id) {
    this.isKing = true;
    document
      .getElementById(this.id + 'K')
      .setAttributeNS(null, 'opacity', '0.7');
  },
  // function that allows a quick setting of an attribute of the specific piece object
  setAtt: function(att, val) {
    this.piece.setAttributeNS(null, att, val);
  }
};

// Checker constructor
function Checker(parent) {
  this.parent = parent; //I can now inherit from Piece class												// each Checker should know its parent piece object
  this.parent.isKing = false; // each Checker should know if its a 'King' or not (not a king on init)
  this.piece = document.createElementNS(game.svgns, 'g'); // each Checker should have an SVG group to store its svg checker in
  // if (this.parent.player == playerId) {
  //   this.piece.setAttributeNS(null, 'style', 'cursor: pointer;'); // change the cursor
  // }
  this.piece.setAttributeNS(
    null,
    'transform',
    'translate(' + (this.parent.x - 30) + ',' + (this.parent.y - 35) + ')'
  );

  // create the svg 'checker' piece.
  //rect x="0px" y="0px" width="100%" height="100%" rx="20" ry="20"
  var rect = document.createElementNS(game.svgns, 'rect');
  rect.setAttributeNS(null, 'width', '60');
  rect.setAttributeNS(null, 'height', '30');
  rect.setAttributeNS(null, 'rx', '5');
  rect.setAttributeNS(null, 'ry', '5');
  rect.setAttributeNS(null, 'text', '5');
  rect.setAttributeNS(null, 'class', 'player'); // change the color according to player
  this.piece.appendChild(rect); // add the svg 'checker' to svg group
  //create more circles to prove I'm moving the group (and to make it purty)
  // var circ = document.createElementNS(game.svgns, 'circle');
  // circ.setAttributeNS(null, 'r', '18');
  // circ.setAttributeNS(null, 'fill', 'white');
  // circ.setAttributeNS(null, 'opacity', '0.3');
  // this.piece.appendChild(circ);
  // var circ = document.createElementNS(game.svgns, 'circle');
  // circ.setAttributeNS(null, 'r', '10');
  // circ.setAttributeNS(null, 'fill', 'white');
  // circ.setAttributeNS(null, 'opacity', '0.3');
  // this.piece.appendChild(circ);

  // /<text x="0" y="50" font-family="Verdana" font-size="35" fill="blue">Hello</text>
  var K = document.createElementNS(game.svgns, 'text');
  K.setAttributeNS(null, 'stroke', 'black');
  K.setAttributeNS(null, 'x', '10');
  K.setAttributeNS(null, 'y', '20');
  K.setAttributeNS(null, 'font-family', 'Verdana');

  //K.setAttributeNS(null, 'points', '-15,-10 -8,10 8,10 15,-10 7,0 0,-18 -7,0');
  // K.setAttributeNS(null, 'stroke', 'black');
  // //K.setAttributeNS(null, 'fill', 'gold');
  // K.setAttributeNS(null, 'stroke-width', '3px');
  // K.setAttributeNS(null, 'opacity', '0');
  // K.setAttributeNS(null, 'id', this.parent.id + 'K');
  if (this.parent.player === this.parent.player_id) {
    K.append(this.parent.text);
  } else {
    var arr = [
      'cell_00',
      'cell_01',
      'cell_02',
      'cell_03',
      'cell_04',
      'cell_05',
      'cell_06',
      'cell_07',
      'cell_08',
      'cell_09',
      'cell_010',
      'cell_011',
      'cell_012',
      'cell_013',
      'cell_60',
      'cell_61',
      'cell_62',
      'cell_63',
      'cell_64',
      'cell_65',
      'cell_66',
      'cell_67',
      'cell_68',
      'cell_69',
      'cell_610',
      'cell_611',
      'cell_612',
      'cell_613'
    ];
    if (arr.indexOf(this.parent.current_cell.id) === -1) {
      K.append(this.parent.text);
    } else {
      this.parent.text = ' -- ';
      K.append(this.parent.text);
    }
  }
  this.piece.appendChild(K);

  // return this object to be stored in a variable
  return this;
}

//to king me:
//getPiece('piece_1|0').kingMe()
//
// tileArr[x][y] = i + ' | ' + j;
