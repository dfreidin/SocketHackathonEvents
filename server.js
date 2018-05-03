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
app.listen(8000);