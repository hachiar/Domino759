<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\GroupChat;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        $groups = GroupChat::all(); //return $groups;
        return view('home')->with('users', $users)->with('groups', $groups);

    }
}
