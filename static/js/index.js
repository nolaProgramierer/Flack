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
  //Add new channels
  document.querySelector('#channel-form').onsubmit = function() {
    const li = document.createElement('li');
    li.setAttribute('class', 'channel')
    li.innerHTML = document.querySelector('#channel-name').value;
    document.querySelector('#channel-item').append(li);
    document.querySelector('#channel-name').value = '';
    // make channels clickable; break out into separate function
    var listChannels = document.getElementsByClassName('channel');
    for (var i = 0; i < listChannels.length; i++) {
      listChannels[i].addEventListener('click', function() {
        // go to channel messages
        alert("Listchannel alert")
      });
    }
    return false;
  };

});
