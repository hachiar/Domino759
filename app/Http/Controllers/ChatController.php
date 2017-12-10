<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\GroupChat;
use App\Chat;
class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $receiver = auth()->user()->id;
      $users = User::all();
      $groups = GroupChat::all();
      $chats = Chat::where('receiver', $receiver)->where('seen', '=', 0)->get();
      //return $chats;
      return view('chat')->with('users', $users)->with('groups', $groups)->with('chats', $chats);
    }

  public function __construct()
    {
        $this->middleware('auth');
    }


    /**
     * Show the form for creating a new resource.
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

        $sender = auth()->user()->id;
        $receiver = $request->id;
        $text = $request->message;
        $chat = new Chat();
        $chat->sender = $sender;
        $chat->receiver = $receiver;
        $chat->text = $text;
        $chat->save();
        if (strpos($receiver, "g") === 0) {
                    $chat = Chat::where('receiver', $receiver)->orderBy('created_at','desc')
                    ->take(1)->get();
        } else {
          $chat = Chat::where([['sender','=',$sender],['receiver','=',$receiver]])
                        ->orWhere([['sender','=',$receiver],['receiver','=',$sender]])->orderBy('created_at','desc')
                        ->take(1)->get();
        }


        return $chat;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $user_id = auth()->user()->id;

      $chat = Chat::where([['sender','=',$user_id],['receiver','=',$id]])->orWhere([['sender','=',$id],['receiver','=',$user_id]])->get();
      $username = [];
      foreach($chat as $c){
        $username[] = $c->userName->name;
      }

      $messages = ['chats'=>$chat, 'users'=>$username];
       return $messages;
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
    public function send(Request $req){
        return 'something';
    }

    public function getGroupChat($id){

    $user_id = auth()->user()->id;

    $chat = Chat::where('receiver', $id)->get();
      $username = [];
      foreach($chat as $c){
        $username[] = $c->userName->name;
      }
      $messages = ['chats'=>$chat, 'users'=>$username];
       return $messages;
    }

    public function notifiSeen($id) {
      //return 'Hello Yar!';
      $userId = auth()->user()->id;
      $chats = Chat::where('sender', '=', $id)->where('receiver', '=',$userId)->where('seen', '=', 0)->get();
      foreach ($chats as $chat) {
        $chat->seen = 1;
        $chat->save();
      }

      return $chats;
    }
}
