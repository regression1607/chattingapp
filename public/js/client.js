$(function () {
    var socket = io();
    $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(data) {
        $('#messages').append($('<li>').text(`${data.name}: ${data.message}`)); // display name and message
    });
});