function loadGame(res, oppo_id) {
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
  if (res.moveData.player1Data[0].player_id == game.THISPLAYER) {
    game.pieceArr[0] = new Array();
    var idCount = 0;

    var x = 0;
    for (i = 0; i < 14; i++, x++) {
      for (j = 0; j < 1; j++) {
        //    if ((i + j) % 2 == 0) {

        var text = res.moveData.player1Data[i].piece_id.split(',');
        var XY = res.moveData.player1Data[i].cell_id.split('_');
        positionX = XY[1].charAt(0);
        positionY = XY[1].charAt(1);
        if (XY[1].length === 3) {
          positionY = XY[1].charAt(1) + '' + XY[1].charAt(2);
        }
        //console.log(text[2]);
        game.pieceArr[0][idCount] = new Piece(
          res.game_id,
          res.moveData.player1Data[0].player_id,
          Number(positionY),
          Number(positionX),
          'Checker',
          idCount,
          text[2],
          res.moveData.player1Data[0].player_id
        );
        //  player1Pieces.push(game.pieceArr[0][idCount].id);
        //  player1Cells.push(game.pieceArr[0][idCount].current_cell.id);
        idCount++;
        //  }
      }
    }
    game.pieceArr[1] = new Array();
    var idCount = 0;
    var x = 0;
    for (i = 0; i < 14; i++, x++) {
      for (j = 6; j < 7; j++) {
        //    if ((i + j) % 2 == 0) {
        var text = res.moveData.player2Data[i].piece_id.split(',');
        var XY = res.moveData.player2Data[i].cell_id.split('_');
        positionX = XY[1].charAt(0);
        positionY = XY[1].charAt(1);
        if (XY[1].length === 3) {
          positionY = XY[1].charAt(1) + '' + XY[1].charAt(2);
        }
        game.pieceArr[1][idCount] = new Piece(
          res.game_id,
          res.moveData.player2Data[i].player_id,
          positionY,
          positionX,
          'Checker',
          idCount,
          text[2],
          res.moveData.player1Data[0].player_id
        );
        //  player1Pieces.push(game.pieceArr[0][idCount].id);
        //  player1Cells.push(game.pieceArr[0][idCount].current_cell.id);
        idCount++;
        //  }
      }
    }
  } else {
    game.pieceArr[0] = new Array();
    var idCount = 0;

    var x = 0;
    for (i = 0; i < 14; i++, x++) {
      for (j = 0; j < 1; j++) {
        //    if ((i + j) % 2 == 0) {
        var text = res.moveData.player1Data[i].piece_id.split(',');
        var XY = res.moveData.player1Data[i].cell_id.split('_');
        positionX = XY[1].charAt(0);
        positionY = XY[1].charAt(1);
        if (XY[1].length === 3) {
          positionY = XY[1].charAt(1) + '' + XY[1].charAt(2);
        }
        game.pieceArr[0][idCount] = new Piece(
          res.game_id,
          res.moveData.player1Data[0].player_id,
          positionY,
          positionX,
          'Checker',
          idCount,
          text[2],
          game.THISPLAYER
        );
        //  player1Pieces.push(game.pieceArr[0][idCount].id);
        //  player1Cells.push(game.pieceArr[0][idCount].current_cell.id);
        idCount++;
        //  }
      }
    }
    game.pieceArr[1] = new Array();
    var idCount = 0;
    var x = 0;
    for (i = 0; i < 14; i++, x++) {
      for (j = 6; j < 7; j++) {
        //    if ((i + j) % 2 == 0) {
        var text = res.moveData.player2Data[i].piece_id.split(',');
        var XY = res.moveData.player2Data[i].cell_id.split('_');
        positionX = XY[1].charAt(0);
        positionY = XY[1].charAt(1);
        if (XY[1].length === 3) {
          positionY = XY[1].charAt(1) + '' + XY[1].charAt(2);
        }
        game.pieceArr[1][idCount] = new Piece(
          res.game_id,
          game.THISPLAYER,
          positionY,
          positionX,
          'Checker',
          idCount,
          text[2],
          game.THISPLAYER
        );
        //  player1Pieces.push(game.pieceArr[0][idCount].id);
        //  player1Cells.push(game.pieceArr[0][idCount].current_cell.id);
        idCount++;
        //  }
      }
    }
  }

  console.log(res.moveData.moves);
  console.log(res.moveData.turn + ' turns');
  var avalLeft = res.moveData.moves.leftCell.split('_');
  var avalRight = res.moveData.moves.rightCell.split('_');
  game.moves = {
    left: {
      cells: {
        row: avalLeft[1].substring(1),
        col: avalLeft[1].substring(0, 1)
      },
      pieces: res.moveData.moves.allowed_left
    },
    right: {
      cells: {
        row: avalRight[1].substring(1),
        col: avalRight[1].substring(0, 1)
      },
      pieces: res.moveData.moves.allowed_right
    },
    turn: res.moveData.turn,
    my_id: res.moveData.my_id
  };
  $('#game_id').attr('value', res.moveData.game_id);
  game.game_id = res.moveData.game_id;

  var myTurn = game.moves.turn == game.moves.my_id;
  if (myTurn) {
    $('#whos_turn')
      .html('Your Turn To Play')
      .css('color', 'green');

    // if (!$('#passTurn')) {
    $('#gameAddOns').html(
      '<button type="button" class="btn btn-info btn-lg" id="passTurn"> Pass </button>'
    );

    $('#passTurn')
      .css({
        margin: '50px',
        float: 'right',
        width: '120px'
      })
      .on('click', function() {
        changeTurns(res.moveData.game_id);
      });
    //    }
    console.log('Your Turn To Play');
  } else {
    $('#whos_turn')
      .html('Wait -- Opponent Turn')
      .css('color', 'red');
    $('#passTurn').remove();
  }

  $('#game_id').attr('value', res.moveData.game_id);
  //console.log(res.moveData.game_id + 'hereXxX');
  var allowedPiecesLeft = game.moves.left.pieces;
  var allowedPiecesRight = game.moves.right.pieces;
  $('#pieceL').html('Left allowed: ' + allowedPiecesLeft);
  $('#pieceR').html('Right allowed: ' + allowedPiecesRight);
}
