const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const mysqlConnection = require("./db/mysql");
const conectarMongo = require("./db/mongo");


app.use(express.static("public"));
app.set("view engine", "ejs");

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

app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor rodando na url http://192.168.100.85:3000");
});
