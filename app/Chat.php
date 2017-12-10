<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    function userName(){
      return $this->belongsTo('App\User', 'sender');
    }
}
