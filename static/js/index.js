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

  // To server; add channel to 'Channels' on form submit
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
  // From server; update the channel listing
  socket.on('announce channel', data => {


    const li = document.createElement('li');
    li.setAttribute('class', 'channel');
    li.innerHTML = data.channel;
    li.setAttribute('data-channel', `${data.channel}`);
    document.querySelector('#channel-item').append(li);
    // Add addEventListener for click function for newly added channel
    document.querySelectorAll('.channel').forEach(channel => {
      channel.onclick = () => {
        const selection = channel.dataset.channel;
        socket.emit('select channel', {'selection': selection});
        return false;
      };
    });
    return false;
  });

  // Onclick channel selection is broadcast for hard-coded channels
  socket.on('connect', () => {
    document.querySelectorAll('.channel').forEach(channel => {
      channel.onclick = () => {
        const selection = channel.dataset.channel;
        socket.emit('select channel', {'selection': selection});
        return false;
      };
    });
  });

  // From server, channel added to 'Channel messages' selection
  socket.on('announce ch selection', data => {
    document.querySelector('#selected-channel').innerHTML = data.selection;
    return false;
  });

  // From client; gather message and channel and send to server
  socket.on('connect', () => {
    document.querySelector('#message-form').onsubmit = () => {
      const message = document.querySelector('#message').value;
      const channel = document.querySelector('#selected-channel').innerHTML;
      const name = localStorage.getItem('name');
      socket.emit('submit message', {'message': message, 'channel': channel, 'name': name});
      document.querySelector('#message').value = '';
      return false;
    };
  });

  // From server, message added to messages list
  socket.on('announce message', data => {

    console.log(data.dict);


    return false;

  });



}); //End DOMContentLoaded
