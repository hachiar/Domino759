function initNewGame(player_id, oppo_id) {
  //create the board...
  //var x = new Cell(document.getElementById('someIDsetByTheServer'),'cell_00',CELLSIZE,0,0);
  var gEle = document.createElementNS(game.svgns, 'g');
  gEle.setAttributeNS(
    null,
    'transform',
    'translate(' + game.BOARDX + ',' + game.BOARDY + ')'
  );
  gEle.setAttributeNS(null, 'id', 'gId_' + 'gameId');
  //stick g on board
  document.getElementsByTagName('svg')[0].appendChild(gEle);
  for (i = 0; i < game.BOARDWIDTH; i++) {
    game.boardArr[i] = new Array();
    for (j = 0; j < game.BOARDHEIGHT; j++) {
      game.boardArr[i][j] = new Cell(
        document.getElementById('gId_' + 'gameId'),
        'cell_' + j + i,
        game.CELLSIZE,
        j,
        i
      );
    }
  }
  //new Piece(player,cellRow,cellCol,type,num)

  var tileArr = [];
  var tile = [];
  var count = 0;
  for (var i = 6; i >= 0; i--) {
    for (var j = i; j >= 0; j--) {
      tile = i + ' | ' + j;
      //if (!tileArr[tile]) {
      tileArr.push(tile);
      //}
    }
  }
  //console.log(tileArr);
  var countX = [];
  for (var i = 27; i >= 0; i--) {
    countX.push(i);
  }
  var randomNumberArr = [];
  var num = null;

  while (countX.length > 0) {
    num = Math.floor(Math.random() * 28);
    //console.log(num);
    index = countX.indexOf(num);
    if (index !== -1) {
      countX.splice(index, 1);
      randomNumberArr.push(num);
    }
    //console.log(countX);
    //  console.log(countX);
  }
  //console.log(randomNumberArr);

  //console.log(tileArr);
  //  console.log(tileArr[1][1]);
  //create red
  //this is where we are creating pieces..
  var player1Pieces = [];
  var player2Pieces = [];
  var player1Cells = [];
  var player2Cells = [];
  game.pieceArr[0] = new Array();
  var idCount = 0;
  var x = 0;
  for (i = 0; i < 14; i++, x++) {
    for (j = 0; j < 1; j++) {
      //    if ((i + j) % 2 == 0) {
      game.pieceArr[0][idCount] = new Piece(
        'game_' + 'gameId',
        game.THISPLAYER,
        i,
        j,
        'Checker',
        idCount,
        tileArr[randomNumberArr[x]],
        game.THISPLAYER
      );
      player1Pieces.push(game.pieceArr[0][idCount].id);
      player1Cells.push(game.pieceArr[0][idCount].current_cell.id);
      idCount++;
      //  }
    }
  }
  //console.log(game.pieceArr[0]);
  //create green
  game.pieceArr[1] = new Array();
  idCount = 0;
  for (i = 0; i < 14; i++, x++) {
    for (j = 6; j < 7; j++) {
      //  if ((i + j) % 2 == 0) {
      game.pieceArr[1][idCount] = new Piece(
        'game_' + 'gameId',
        oppo_id,
        i,
        j,
        'Checker',
        idCount,
        tileArr[randomNumberArr[x]],
        game.THISPLAYER
      );
      player2Pieces.push(game.pieceArr[1][idCount].id);
      player2Cells.push(game.pieceArr[1][idCount].current_cell.id);
      idCount++;
      //  }
    }
  }

  var path = './init';
  //console.log(user_id + message);
  myXHR(
    path,
    'POST',
    {
      player1: player1Pieces,
      player2: player2Pieces,
      player1Cells: player1Cells,
      player2Cells: player2Cells,
      opponentPlayerID: oppo_id
    },
    ''
  ).done(function(res) {
    var avalLeft = res.leftCell.split('_');
    var avalRight = res.rightCell.split('_');
    game.moves = {
      left: {
        cells: {
          row: avalLeft[1].substring(1),
          col: avalLeft[1].substring(0, 1)
        },
        pieces: res.allowed_left
      },
      right: {
        cells: {
          row: avalRight[1].substring(1),
          col: avalRight[1].substring(0, 1)
        },
        pieces: res.allowed_right
      },
      turn: res.turn,
      my_id: res.my_id
    };
    console.log(game.moves);
    console.log(res);
    $('#game_id').attr('value', res.game_id);
    game.game_id = res.game_id;
  });
}
