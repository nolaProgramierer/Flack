// Add name to local storage if name does not exist
document.addEventListener('DOMContentLoaded', function() {

  if (!localStorage.getItem('name')) {
    document.querySelector('#current-user').innerHTML = "Please sign in";
      document.querySelector('#user-form').onsubmit = function() {
        let name = document.querySelector('#user-name').value;
        localStorage.setItem('name', name);
        document.querySelector('#current-user').innerHTML = localStorage.getItem('name')
      } //onsubmit
    return false;
  } else {
    // Load current value of localStorage
    document.querySelector('#current-user').innerHTML = localStorage.getItem('name')
    //localStorage.clear();
    return false;
    }
  }
);
// Add new channel to ul
document.addEventListener('DOMContentLoaded', function() {
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
  }
});


// Add channel to local storage if channel does not exist
document.addEventListener('DOMContentLoaded', function() {

  if (!localStorage.getItem('channel')) {
    document.querySelector('#current-user').innerHTML = "Please sign in";
      document.querySelector('#user-form').onsubmit = function() {
        let name = document.querySelector('#user-name').value;
        localStorage.setItem('name', name);
        document.querySelector('#current-user').innerHTML = localStorage.getItem('name')
      } //onsubmit
    return false;
  } else {
    // Load current value of localStorage
    document.querySelector('#current-user').innerHTML = localStorage.getItem('name')
    //localStorage.clear();
    return false;
    }
  }
);
