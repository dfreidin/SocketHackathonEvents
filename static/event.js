function appendToChat(msg) {
    var str = "<p><span class='chat_username'>" + msg.username + "</span>: <span class='chat_message'>" + msg.msg + "</span></p>";
    $("#chatroom").append(str);
}

$(document).ready(function(){
    var socket = io();
    io.emit("join_room", {room: $("#chatroom").attr("data-room"), username: $("#chatroom").attr("data-username")});
    io.on("past_chat", function(data){
        for(var i=0; i<data.messages.length; i++) {
            appendToChat(data.messages[i]);
        }
    });
    io.on("new_message", function(data){
        appendToChat(data.msg);
    });
    $("#chat_form").submit(function(e){
        e.preventDefault();
        io.emit("post_message", {msg: $("#chat_message").val()});
        $(this)[0].reset();
    });
});