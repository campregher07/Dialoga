const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();


const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
    console.error("Erro: Variável de ambiente MONGODB_URI não definida.");
    process.exit(1);
}

const conectarMongo = require("./db/mongo");
conectarMongo();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
    secret: process.env.SESSION_SECRET , // Use variável de ambiente para o segredo!
    resave: false,
    saveUninitialized: false, // Não salvar sessões não inicializadas
    store: MongoStore.create({ 
        mongoUrl: dbURI, 
        collectionName: "sessions" // Nome da coleção para guardar sessões
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 ,// Duração do cookie (ex: 1 dia)
        // secure: process.env.NODE_ENV === "production" // Descomente isso em produção se usar HTTPS
    }
}));

app.use((req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.userId = req.session.userId;
    next();
});

// Rotas
const authRoutes = require("./Routes/authRoutes");
const diaryRoutes = require("./Routes/diaryRoutes");
const reportRoutes = require("./Routes/reportRoutes");
const homeRoutes = require('./Routes/homeRoutes');
const communityRoutes = require('./Routes/communityRoutes');
const WorkingRoutes = require('./Routes/workingRoutes');

app.use("/", authRoutes);
app.use("/", diaryRoutes);
app.use("/", reportRoutes);
app.use('/', homeRoutes);
app.use('/', WorkingRoutes);
app.use('/', communityRoutes);

const PORT = process.env.PORT; 
app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Servidor rodando na url http://localhost:${PORT}`);
});

module.exports = app;