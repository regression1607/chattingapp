const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const routes = require('./routes');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const Message = require('./models/Message');
const sharedsession = require("socket.io-express-session");
require('dotenv').config();


const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error(err);
});

var sessionMiddleware = session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use('/', routes);
app.use(express.static('public'));

io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}));

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.name = socket.handshake.session.name;

    Message.find({}).then((messages) => {
        socket.emit('load all messages', messages);
    }).catch((err) => {
        console.error(err);
    });

    socket.on('chat message', (msg) => {
        const message = new Message({ name: socket.name, message: msg });
        message.save().then(() => {
            io.emit('chat message', { name: socket.name, message: msg });
        }).catch((err) => {
            console.error(err);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is up on port 3000');
});