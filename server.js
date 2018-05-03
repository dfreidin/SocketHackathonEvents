const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const io = require("socket.io")(app);
app.use(express.static(__dirname + "/static"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "swordfish",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
var socket_users = {};
var chat_rooms = {};
io.on("connection", function(socket){
    socket.on("join_room", function(data){
        socket.join(data.room);
        socket_users[socket.id] = [data.username, data.room];
        if(chat_rooms[data.room]) {
            socket.emit("past_chat", {messages: chat_rooms[data.room]});
        }
        else {
            chat_rooms[data.room] = [];
        }
    });
    socket.on("post_message", function(data){
        var message = {username: socket_users[socket.id][0], msg = data.msg}
        chat_rooms[data.room].push(message);
        io.in(socket_users[socket.id][1]).emit("new_message", message);
    });
});
app.listen(8000);