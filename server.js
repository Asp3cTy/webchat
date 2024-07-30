const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

let userCount = 0;

// Configurar o banco de dados MySQL
const db = mysql.createConnection({
    host: "certidoes.c3mqsqck0m3x.sa-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Palmares2018!",
    database: "chat_app",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log("Connected to database");
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Servir arquivos estáticos da pasta node_modules/emoji-picker-element
app.use('/emoji-picker-element', express.static(path.join(__dirname, 'node_modules/emoji-picker-element')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas de autenticação
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [username, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Username already exists');
            }
            return res.status(500).send('Server error');
        }
        res.status(200).send('User registered');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(400).send('User not found');
        }
        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).send('Incorrect password');
        }
        req.session.user = user;
        res.status(200).json({ message: 'User logged in', userId: user.id });
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('User logged out');
});

// Socket.io configuração
io.on("connection", function(socket) {
    userCount++;
    io.emit("userCount", userCount);

    socket.on("newuser", function(username) {
        socket.broadcast.emit("update", username + " entrou na conversa!");
    });

    socket.on("exituser", function(username) {
        socket.broadcast.emit("update", username + " saiu da conversa!");
    });

    socket.on("disconnect", function() {
        userCount--;
        io.emit("userCount", userCount);
    });

    // Recuperar mensagens do banco de dados quando o usuário se conecta
    socket.on('getMessages', () => {
        const query = 'SELECT * FROM messages ORDER BY created_at';
        db.query(query, (err, results) => {
            if (err) throw err;
            socket.emit('allMessages', results);
        });
    });

    socket.on("chat", function(message) {
        const query = 'INSERT INTO messages (username, message, image, time, reply_to) VALUES (?, ?, ?, ?, ?)';
        const values = [message.username, message.text, message.image, message.time, message.replyTo ? message.replyTo.id : null];

        db.query(query, values, (err, result) => {
            if (err) throw err;
            socket.broadcast.emit("chat", message);
        });
    });

    // Evento de digitação
    socket.on("typing", function(data) {
        socket.broadcast.emit("typing", data);
    });

    socket.on("stopTyping", function(data) {
        socket.broadcast.emit("stopTyping", data);
    });
});

server.listen(port, function() {
    console.log("Server running on port 5000");
});
