@extends('layouts.app')
@section('content')
	<style media="screen">
		.info{
			margin-left:125px;
			margin-right: auto;
		}
	</style>
<input type='hidden' id="game_id">
<input type='hidden' id="opponent_id" value = "{{ $oppo_id }}">
<input type='hidden' id="pid" value = "{{ $id }}">
<svg xmlns="http://www.w3.org/2000/svg"
	version="1.1"  width="1300px" height="350px">

</svg>
<div class="gameAddOn" id="gameAddOns">

</div>
<div style="margin:55px">
	<h4 id="pieceL">Left allowed: 6</h4>
	<h4 id="pieceR">Right allowed: 6</h4>
	<h3 id="whos_turn">Who has 6-6?</h3>
</div>

@endsection
