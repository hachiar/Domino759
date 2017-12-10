function flipTile(myPiece, sideNum) {
  // //var ids = this.id.split(',');
  // var sideNum = ids[2].split(' | ');
  //
  var leftTextNum = sideNum[0];
  var rightTextNum = sideNum[1];
  var newText = rightTextNum + ' | ' + leftTextNum;

  myPiece.lastChild.innerHTML = newText;
}

function movePiece(
  path,
  gameexist,
  newDirection,
  newAllowed,
  cell_id,
  thisPiece
) {
  myXHR(path, 'POST', {
    game_id: gameexist,
    direction: newDirection,
    updateAllowed: newAllowed,
    updateCell: cell_id,
    pieceId: thisPiece
  }).done(function(res) {
    console.log('return from movePiece: ' + res);
    var oppo_id = $('#opponent_id').attr('value');
    var path = './load/' + oppo_id;

    myXHR(path, 'GET', { game_id: gameexist }).done(function(res) {
      console.log(res);
      if (res.moveData) {
        $('svg').empty();
        loadGame(res, oppo_id);
      } else if (res.results) {
        gameOver(res);
      }
    });
  });
}

function changeTurns(game_id) {
  //alert(game_id);
  var path = './passTurn';
  myXHR(path, 'POST', {
    game_id: game_id
  }).done(function(res) {});
}

function gameOver(res) {
  $('svg')
    .delay(300)
    .html(
      '<text stroke="black" x="110" y="200" font-family="Verdana" font-size="35" fill="red">Game Over</text>'
    )
    .delay(800)
    .fadeIn(400)
    .animate(
      {
        width: ['toggle', 'swing'],
        height: ['toggle', 'swing'],
        opacity: 'toggle'
      },
      7000
    );

  $('#pieceL').html('');
  $('#pieceR').html('');

  var won = res.results.winner == game.moves.my_id;
  if (won) {
    $('#whos_turn')
      .html('You WON!')
      .css({
        color: 'green',
        'font-size': '75px',
        'margin-left': '300px'
      });

    // if (!$('#passTurn')) {
    $('#gameAddOns').html(
      '<button type="button" class="btn btn-info btn-lg" id="passTurn"> Play Again </button>'
    );

    $('#passTurn')
      .css({
        margin: '50px',
        float: 'right',
        width: '120px'
      })
      .on('click', function() {
        startNewGame(game.moves.my_id, res.results.loser);
      });
    //    }
  } else {
    $('#whos_turn')
      .html('You Lost :( ')
      .css({ color: 'red', 'font-size': '75px', 'margin-left': '300px' });

    $('#gameAddOns').html(
      '<button type="button" class="btn btn-info btn-lg" id="passTurn"> Play Again </button>'
    );

    $('#passTurn')
      .css({
        margin: '50px',
        float: 'right',
        width: '120px'
      })
      .on('click', function() {
        startNewGame(res.results.loser, game.moves.my_id);
      });
  }
  // $('#whos_turn').
}

function startNewGame(player_id, oppo_id) {
  location.reload(true);
}
