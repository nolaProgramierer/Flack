// Add name to local storage if name does not exist
document.addEventListener('DOMContentLoaded', function() {
  // If no user in localStorage, add one
  if (!localStorage.getItem('name')) {
    document.querySelector('#current-user').innerHTML = "Please sign in";
      document.querySelector('#user-form').onsubmit = function() {
        let name = document.querySelector('#user-name').value;
        localStorage.setItem('name', name);
        document.querySelector('#current-user').innerHTML = localStorage.getItem('name');
        document.querySelector('#user-name').value = '';
      } //onsubmit
    return false;
  } else {
      var currentUser = localStorage.getItem('name');
      document.querySelector('#user-form').onsubmit = function() {
        localStorage.removeItem(currentUser);
        let name = document.querySelector('#user-name').value;
        localStorage.setItem('name', name);
        var currentUser = localStorage.getItem('name');
        //document.querySelector('#current-user').innerHTML = currentUser;
        // Load current value of localStorage
        document.querySelector('#current-user').innerHTML = "Welcome " + currentUser + "!";
        document.querySelector('#user-name').value = '';
        //localStorage.clear();
        return false;
    }
  }

  // Connection code for socket.io
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // Semd channel name to server
  socket.on('connect', () => {
    document.querySelector('#channel-form').onsubmit = () => {
      const ch = document.querySelector('#channel-name').value
      // Check for duplicate channel
      let match = document.querySelector(`li[data-channel=${ch}]`);
      if (match) {
        alert(`The channel ${ch} already exists.`);
        document.querySelector('#channel-name').value = '';
        return false;
      }
      else {
        socket.emit('submit channel', {'channel': ch});
        document.querySelector('#channel-name').value = '';
        return false;
      }
    }
  });
  // Receive channel name from server
  socket.on('announce channel', data => {
    // Add channel to client channel list
    const li = document.createElement('li');
    li.setAttribute('class', 'channel');
    li.innerHTML = data.channel;
    li.setAttribute('data-channel', `${data.channel}`);
    document.querySelector('#channel-item').append(li);
    document.querySelector('#selected-channel').innerHTML = data.channel;
    selection = data.channel
    socket.emit('channel selection', {'selection': selection});
    return false;
  });



  // Receive data obj from server with added channel and default values
  // Display default values in client channel listing
  socket.on('announce ch selection', data => {
    document.querySelector('#selected-channel').innerHTML = data.channel;
    socket.emit('channel selection', {'data': data, 'selection': data.channel});


    return false;
  });

  // From client; gather message and channel and send to server
  socket.on('send channel message', data => {
    console.log(data.channel);
    var channel = data.channel;
    document.querySelector('#message-form').onsubmit = () => {
      const message = document.querySelector('#message').value;
      //const channel = document.querySelector('#selected-channel').innerHTML;
      const name = localStorage.getItem('name');
      socket.emit('submit message', {'message': message, 'channel': channel, 'name': name});
      document.querySelector('#message').value = '';
      return false;
    };
    return false;
  });

  // From server, message added to messages list
  socket.on('announce message', data => {
    console.log(data.dict);

    var flack = data.dict;
    var obj = JSON.parse(flack);
    console.log(obj);
    // Add only the messages to the message list which have the key corresponding
    // to the selected channel in the HTML
    var key = data.channel;
    var channelName = document.querySelector('#selected-channel').innerHTML;

    // Loop through object at channel name keys returning the values of the array nested objects
    // by matching the selected HTML channel with the channel from channel from the data object
    document.querySelector('tbody').innerHTML = '';
    if (key == channelName) {
      var tb = document.querySelector('tbody');
      for (var i in obj[key]) {
        var currRow = document.createElement('tr');
        console.log(obj[key][i]);
        for (var j in obj[key][i]) {
          var currCell = document.createElement('td');
          currCell.textContent = obj[key][i][j];
          currRow.appendChild(currCell);
          console.log(obj[key][i][j]);
        }
      tb.appendChild(currRow);
      }
    };
    return false;
  });



}); //End DOMContentLoaded
function makeTable() {

}
