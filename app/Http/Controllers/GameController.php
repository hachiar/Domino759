<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Game;
use App\Moves;
use App\Turns;
use App\ActiveCells;
use App\Result;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */


     public function __construct()
     {
         $this->middleware('auth');
     }


    public function index()
    {
        // return view('game');

    }
    public function play($id){
        return view('game')->with('oppo_id',$id)->with('id',auth()->user()->id);
    }


    /**
     * Show the form focreating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return $request;
    }





    public function getAllowed($gameId){
        $activeCell = ActiveCells::where('game_id', $gameId)->first();
        return array('game_id'=>$activeCell->game_id,'leftCell'=>$activeCell->leftCell,
        'rightCell'=>$activeCell->rightCell, 'allowed_left'=>$activeCell->allowed_left,
        'allowed_right'=>$activeCell->allowed_right);
    }




    public function storeMove(Request $request)
    {

      $game = Game::where('id',$request->game_id)->first();
      $turn = Turns::where('game_id', $request->game_id)->first();

      if (auth()->user()->id != $turn->turn) {
        return "Not your Turn";
      };
      $activeCell = ActiveCells::where('game_id', $request->game_id)->first();
      $moves = Moves::where('piece_id', $request->pieceId)->where('game_id', $request->game_id)->first();
      if($request->updateCell === $activeCell->leftCell && $request->updateCell === $activeCell->rightCell)
      {
          list($cell, $number ) = explode('_',$request->updateCell);
          $number++;
          $activeCell->rightCell   = $cell.'_'.$number;
          list($cell, $number ) = explode('_',$request->updateCell);
          $number--;
          $activeCell->leftCell   = $cell.'_'.$number;
          $moves->cell_id = $request->updateCell;
          $activeCell->save();
          $moves->save();
          ($turn->turn == $game->player1)?$turn->turn = $game->player2: $turn->turn = $game->player1;
          $turn->save();
          return $moves;
      }
      list($cell, $number ) = explode('_',$request->updateCell);
      if($request->direction == 'right'){

      $num1 = substr($number,0,1);
      $num2 = substr($number,1);
      if ((int)$num1 == 3) {
          if (0 <= $num2 && $num2<= 9 ) {
            (int)$num2++;
          }elseif ($num2==10) {
            (int)$num2 =11;
          }elseif ($num2>=11 && $num2<13) {
            (int)$num2++;
          }elseif ($num2<0) {
          (int)$num2=0;
            (int)$num1--;
          }elseif ($num2>=13) {
            (int)$num2=(int)$num2;
            (int)$num1++;
          }
      }else {
          if (0 <= $num2 && $num2<= 9 ) {
            (int)$num2--;
          }elseif ($num2==10) {
            (int)$num2 =9;
          }elseif ($num2>=11 && $num2<=13) {
            (int)$num2--;
          }elseif ($num2<0) {
          (int)$num2=0;
            (int)$num1++;}

    }

      //(int)$num2++;
      $activeCell->allowed_right = $request->updateAllowed;
      $activeCell->rightCell   = $cell.'_'.$num1 . $num2;
    }
    else {
      $num1 = substr($number,0,1);
      $num2 = substr($number,1);

      if ($num1==3) {
      if (0 < $num2 && $num2<= 9 ) {
        (int)$num2--;
      }elseif ($num2==10) {
        (int)$num2 =9;
      }elseif ($num2>=11 && $num2<=13) {
        (int)$num2--;
      }elseif ($num2==0) {
        (int)$num2=(int)$num2;
        (int)$num1--;
      }elseif ($num2>13) {
        (int)$num2=13;
        (int)$num1--;
      }
    }else {
      if (0 <= $num2 && $num2<= 9 ) {
        (int)$num2++;
      }elseif ($num2==10) {
        (int)$num2 =11;
      }elseif ($num2>=11 && $num2<=13) {
        (int)$num2++;
      }elseif ($num2<0) {
      (int)$num2=0;
        (int)$num1++;}
    }

      //(int)$num2--;
      $activeCell->allowed_left = $request->updateAllowed;
      $activeCell->leftCell   = $cell.'_'.$num1 . $num2;
    }
    $moves->cell_id = $request->updateCell;
    $activeCell->save();
    $moves->save();


    ($turn->turn == $game->player1)?$turn->turn = $game->player2: $turn->turn = $game->player1;
    $turn->save();



    /*************************************************/
    // checking functionality

    $moves = Moves::where('player_id', auth()->user()->id)->where('game_id', $request->game_id)->get();
    // return $moves;
    $arr = [ 'cell_00','cell_01','cell_02','cell_03','cell_04','cell_05','cell_06','cell_07',
      'cell_08','cell_09', 'cell_010','cell_011','cell_012','cell_013','cell_60','cell_61',
      'cell_62','cell_63','cell_64','cell_65','cell_66','cell_67','cell_68','cell_69','cell_610',
      'cell_611','cell_612','cell_613'];
      $pcsLeft =[];
      foreach($moves as $move)
      {
        $pcsLeft[] = $move->cell_id;
      }
      //$unmoved = !empty(array_intersect($pcsLeft, $arr));
        if(!empty(array_intersect($pcsLeft, $arr))){
            $player1 = $game->player1;
            $player2 = $game->player2;

            if(auth()->user()->id == $player1){
              $winner = $player1;
              $loser =$player2;
            }else{
              $winner = $player2;
              $loser =$player1;
            }
              $results = new Result();
              $results->game_id = $game->id;
              $results->winner = $winner;
              $results->loser = $loser;
              $results->save();


              // use App\Game;
              // use App\Moves;
              // use App\Turns;
              // use App\ActiveCells;

              //$game->delete();

              Moves::where('game_id', $game->id)->delete();
              Turns::where('game_id', $game->id)->delete();
              ActiveCells::where('game_id', $game->id)->delete();

              return 'you won!';

            }else {
              return 'continue';
            }

    /***************************************************/
  }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    public function changeTurns(Request $request)
    {

        $turn = Turns::where('game_id', $request->game_id)->first();
        $game = Game::where('id', $request->game_id)->first();
        //return auth()->user()->id;
        if ($turn->turn == auth()->user()->id) {
          ($turn->turn === $game->player1)?$turn->turn = $game->player2:
          $turn->turn = $game->player1;
          $turn->save();
          return $turn->turn;
        }else {
          return;
        }
        //$current_player = auth()->user()->id;
        return 'turn change';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }


    public function initGame(Request $request){

      $user1 = auth()->user()->id;
      $id = $request->opponentPlayerID;

      $game = new Game();
      $game->player1 = $user1;
      $game->player2 = $request->opponentPlayerID;
      $flag = true;
      foreach ($request->player1 as $pieceid) {
        $pos = strpos($pieceid, '6 | 6');
        if($pos){
          $game->whostarts = auth()->user()->id;
          $flag = false;
          break;
        }
      }
      if($flag){
        $game->whostarts = $request->opponentPlayerID;
        }

        $game->save();
        //return count($request->player1);
        for ($i=0; $i < count($request->player1) ; $i++) {
          $moves = new Moves();
          $moves->game_id = $game->id;
          $moves->player_id = auth()->user()->id;
          $moves->cell_id = $request->player1Cells[$i];
          $moves->piece_id = $request->player1[$i];
          $moves->save();
        }
        for ($i=0; $i < count($request->player1) ; $i++) {
          $moves = new Moves();
          $moves->game_id = $game->id;
          $moves->player_id = $request->opponentPlayerID;
          $moves->cell_id = $request->player2Cells[$i];
          $moves->piece_id = $request->player2[$i];
          $moves->save();
        }

        $turn = new Turns();
        $turn->game_id = $game->id;
        $turn->turn = $game->whostarts;
        $turn->save();

        $actCells = new ActiveCells;

        $actCells->game_id = $game->id;
        $actCells->leftCell = 'cell_37';
        $actCells->rightCell = 'cell_37';
        $actCells->allowed_left = '6';
        $actCells->allowed_right = '6';
        $actCells->save();


         return array('game_id'=>$actCells->game_id,'leftCell'=>$actCells->leftCell,
        'rightCell'=>$actCells->rightCell, 'allowed_left'=>$actCells->allowed_left,
        'allowed_right'=>$actCells->allowed_right, 'turn'=>  $turn->turn, 'my_id'=>auth()->user()->id );


    }


public  function loadGame($id, Request $req ){

  $results = Result::where('game_id', $req->game_id)->first();
  if ($results) {
      $gameOver = ['game_id'=>$req->game_id,
      'winner'=>$results->winner, 'loser'=>$results->loser];
        Game::where('id', $req->game_id)->delete();
        return array('results'=>$results);
  }

  //return $req->game_id;
  $user1 = auth()->user()->id;
  $game = Game::where([['player1','=',$id],['player2','=',$user1]])
                ->orWhere([['player1','=',$user1],['player2','=',$id]])
                ->first();
  if($game != null){
    // check results table


    //if(Results::where(game_id) != null)
    $moves = Moves::where('game_id', $game->id)->get();
    $count = 0;
    $moveData = [];
    $player1 = [];
    $player2 = [];

    foreach($moves as $move)
    {
      if($count <= 13)
      {
         $player1 [] = $move;
      }
      else{
        $player2 [] = $move;
      }
      $count++;
    }
    $actCells = ActiveCells::where('game_id', $game->id)->first();

    $turn = Turns::where('game_id', $game->id)->first();

    $moves = ['leftCell'=>$actCells->leftCell,
    'rightCell'=>$actCells->rightCell, 'allowed_left'=>$actCells->allowed_left,
    'allowed_right'=>$actCells->allowed_right];
    $moveData = ['game_id' => $game->id, 'containData' => true ,'player1Data' => $player1,
     'player2Data' => $player2, 'moves' =>  $moves, 'turn'=>  $turn->turn, 'my_id'=>auth()->user()->id  ];
//return $moveData;
    return array('moveData'=>$moveData);
}
}
}
