const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
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

app.get("/index", function(req, res){
    res.render("index");
})

server = app.listen(8000);
const io = require("socket.io")(server);
io.on("connection", function(socket){ 
    socket.on("join_room", function(data){
        console.log(data.username + " is joining room " + data.room);
        socket.join(data.room);
        socket_users[socket.id] = [data.username, data.room];
        if(chat_rooms[data.room]) {
            console.log("sending chat logs for room " + data.room);
            socket.emit("past_chat", {messages: chat_rooms[data.room]});
        }
        else {
            console.log("creating new logs for room " + data.room);
            chat_rooms[data.room] = [];
        }
    });
    socket.on("post_message", function(data){
        console.log("received message from " + socket_users[socket.id][0] + ": " + data.msg);
        var message = {username: socket_users[socket.id][0], msg: data.msg}
        chat_rooms[socket_users[socket.id][1]].push(message);
        io.in(socket_users[socket.id][1]).emit("new_message", message);
    });
});