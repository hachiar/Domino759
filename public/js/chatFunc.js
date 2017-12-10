user_id = '';

function myXHR(path, method, d, id) {
  //ajax shortcut
  return $.ajax({
    type: method,
    url: path,
    data: d,
    headers: { 'X-CSRF-TOKEN': $('input[name=_token]').val() },

    beforeSend: function() {
      //turn on spinner
    }
  })
    .always(function() {
      //sconsole.log('here');
    })
    .fail(function(err) {
      console.log(err);
    });
}

//console.log();
function openChat(id) {
  var user_id = id.getAttribute('id');

  var chatBox = '';
  chatBox =
    '<div id="messageDiv" style="height:375px;overflow:auto;border-style:inset;border-width:1px;border-radius:5px">';

  chatBox += '</div>';
  chatBox +=
    '<div id="chatDiv"><input type="text" class="form-control" id="messageIn" placeholder="Write a Message Here .."><button type="submit" class="btn btn-primary" id="' +
    user_id +
    '" onclick="sendMessage(this)">Send... </button></div>';

  $('#chatMessage').html(chatBox);

  displayChat(user_id);

  var btn = document.getElementById('messageIn');
  btn.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
      sendMessage(user_id);
    }
  });

  notifiSeen(user_id);
}

function openGroupChat(id) {
  var user_id = id.getAttribute('id');

  var chatBox = '';
  chatBox =
    '<div id="messageDiv" style="height:375px;overflow:auto;border-style:inset;border-width:1px;border-radius:5px">';

  chatBox += '</div>';
  chatBox +=
    '<div id="chatDiv"><input type="text" class="form-control" id="messageIn" placeholder="Write a Message Here .."><button type="submit" class="btn btn-primary" id="' +
    user_id +
    '" onclick="sendMessage(this)">Send... </button></div>';

  $('#chatMessage').html(chatBox);

  displayChat(user_id, 'group');

  var btn = document.getElementById('messageIn');
  btn.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
      sendMessage(user_id, 'group');
    }
  });
}

function sendMessage(user_id, g = 'i') {
  var message = document.getElementById('messageIn').value;
  if (message) {
    var path = './chat';
    //console.log(user_id + message);
    myXHR(path, 'POST', { id: user_id, message: message }, '').done(function(
      res
    ) {
      console.log(res);
      displayChat(user_id, g);
    });
  }

  document.getElementById('messageIn').value = '';
}

function displayChat(id, whatType = 'individual') {
  var path = '';
  whatType === 'group'
    ? (path = './chat/group/' + id)
    : (path = './chat/' + id);

  //var user_id = id;
  //var path = './chat/' + id;
  console.log(typeof id, typeof user_id);
  myXHR(path, 'GET', '', '').done(function(res) {
    //console.log(res);
    if (res) {
      var chats = '';
      chats =
        '<ul class="list-group"><li class="list-group-item list-group-item-action active">Caht</li>';
      res.chats.forEach(function(e, index) {
        chats +=
          '<li class="list-group-item list-group-item-warning">' +
          res.users[index] +
          ' <small>said: </small><br>' +
          e.text +
          '</li>';
      });
      chats += '</ul>';

      $('#messageDiv').html(chats);
    }
  });
}

function notifiSeen(user_id) {
  //alert(user_id);
  var path = './chat/notify/' + user_id;
  //console.log(user_id + message);
  myXHR(path, 'POST', { id: user_id }, '');
  //.done(function(res) {displayChat(user_id, g);});
}
