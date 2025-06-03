const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();



const conectarMongo = require("./db/mongo");
conectarMongo();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
    secret: "dialogaSegredo123",
    resave: false,
    saveUninitialized: true,
}));

// Rotas
const authRoutes = require("./Routes/authRoutes");
const diaryRoutes = require("./Routes/diaryRoutes");
const reportRoutes = require("./Routes/reportRoutes");
const homeRoutes = require('./Routes/homeRoutes');

app.use("/", authRoutes);
app.use("/", diaryRoutes);
app.use("/", reportRoutes);
app.use('/', homeRoutes);

const PORT = process.env.PORT || 3000; // Usar variável de ambiente ou porta padrão
app.listen(PORT, '0.0.0.0', () => { // Escutar em 0.0.0.0 para acessibilidade externa se necessário
    console.log(`Servidor rodando na url http://localhost:${PORT}`);
});

