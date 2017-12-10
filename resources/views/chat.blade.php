@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-3 col-lg-3">
            <div class="panel panel-default">
                <div class="panel-body">
                    @if (session('status'))
                        <div class="alert alert-success">
                            {{ session('status') }}
                            @endif
                        </div>

                        <div class="display_users float-right">
                          @if (count($users)>0)
                        <table class="table table-striped">
                          <tr>
                            <th>Users</th>
                            {{-- @foreach ($chats as $chat)
                              <p>{{$chat->sender}} - {{$chat->seen}}</p>
                            @endforeach --}}
                            {{-- @php
                              print_r ($chats->text);
                            @endphp --}}
                          </tr>
                          @foreach($users as $user)
                            <tr>
                                <td onclick="openChat(this)" id="{{$user->id}}">{{$user->name}}
                                  @php
                                      $count =0;
                                      $newMesage =' New ';
                                   @endphp
                                    @foreach ($chats as $chat)

                                        @if ($chat->sender == $user->id)
                                        @php
                                          $count++;
                                        @endphp
                                        @endif
                                    @endforeach
                                    <small style="color:red;float: right;"> @php
                                      echo $count>0? "(".$count . " " . $newMesage.")": ''; @endphp</small>
                                    </td>
                            </tr>
                          @endforeach
                        </table>
                      @else
                        <p>No Active Users </p>
                        @endif
                        </div>
                        <div class="display_users float-right">
                          @if (count($groups)>0)
                        <table class="table table-striped">
                          <tr>
                            <th >Groups</th>
                          </tr>
                          @foreach($groups as $group)
                            <tr>
                                <td onclick="openGroupChat(this)" id="{{$group->group_id}}">{{$group->name}}</td>

                            </tr>
                          @endforeach
                        </table>
                      @else
                        <p>No Active Groups </p>
                        @endif
                        </div>
                </div>
            </div>
            <div class='col-md-8 col-lg-8' id="chatMessage">

            </div>
        </div>

    </div>
</div>
@endsection
