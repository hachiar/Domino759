<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::resource('/chat', 'ChatController');
Route::post('/chat/notify/{id}', 'ChatController@notifiSeen');
// Route::resource('/group', 'GroupController');
Route::post('/chat/sendMessage','ChatController@send');
Route::get('/chat/group/{id}','ChatController@getGroupChat');

Route::resource('/game', 'GameController');
Route::get('/game/play/{id}', 'GameController@play');

Route::post('/game/play/init', 'GameController@initGame');
Route::get('/game/play/load/{id}', 'GameController@loadGame');
Route::post('/game/play/store', 'GameController@storeMove');
Route::post('/game/play/passTurn', 'GameController@changeTurns');
Route::get('/game/play/getAllowed/{gameId}', 'GameController@getAllowed');
