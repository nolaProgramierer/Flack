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

  // Event to add channel to the Python server
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () => {
    document.querySelector('#channel-form').onsubmit = () => {
      const ch = document.querySelector('#channel-name').value;
      socket.emit('submit channel', {'channel': ch});
      document.querySelector('#channel-name').value = '';
      return false;
    }
  });
  // From the server the clients are updated with the data and HTML
  socket.on('announce channel', data => {
    const li = document.createElement('li');
    li.setAttribute('class', 'channel');
    li.innerHTML = `Channel added: ${data.channel}`;
    li.setAttribute('data-channel', `${data.channel}`);
    document.querySelector('#channel-item').append(li);
    return false;
  });

  // Add channel selection to broadcast
  socket.on('connect', () => {
    document.querySelectorAll('.channel').forEach(channel => {
      channel.onclick = () => {
        const selection = channel.dataset.channel;
        socket.emit('select channel', {'selection': selection});
        return false;
      };
    });
  });

  // From the server update the clients with the channel and HJTML
  socket.on('announce ch selection', data => {
    document.querySelector('#selected-channel').innerHTML = `Select channel: ${data.selection}`;
    return false;
  });




}); //End DOMContentLoaded
