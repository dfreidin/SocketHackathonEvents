function appendToChat(msg) {
    var str = "<p><span class='chat_username'>" + msg.username + "</span>: <span class='chat_message'>" + msg.msg + "</span></p>";
    $("#chatroom").append(str);
}
function scrollChat() {
    el = document.getElementById("chatroom");
    el.scrollTop = el.scrollHeight;
}

$(document).ready(function(){
    var socket = io();
    console.log("joining room: " + $("#chatroom").attr("data-room"));
    socket.emit("join_room", {room: $("#chatroom").attr("data-room")});
    socket.on("past_chat", function(data){
        $("#chatroom").html("");
        for(var i=0; i<data.messages.length; i++) {
            appendToChat(data.messages[i]);
        }
        scrollChat();
    });
    socket.on("reload", function(data){
        location.reload();
    })
    socket.on("new_message", function(data){
        appendToChat(data);
        scrollChat();
    });
    $("#chat_form").submit(function(e){
        e.preventDefault();
        socket.emit("post_message", {msg: $("#chat_message").val()});
        $(this)[0].reset();
    });
});