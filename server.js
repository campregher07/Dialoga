const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');

app.use(express.static("public"));
app.set('view engine', 'ejs');

const uri = "mongodb://localhost:27017/DialogaDB";
const client = new MongoClient(uri);

mongoose.connect('mongodb://localhost:27017/DialogaDB')
  .then(() => console.log('Conexão com MongoDB ok!'))
  .catch((err) => console.error('Erro na conexão:', err));
  

const connection = mysql.createConnection({
    host: 'localhost', //endereço do banco de dados
    user: 'root', //nome do usuario do banco
    password: 'Dani090707*', // senha do banco
    database: 'DialogaDatabase', // nome do banco
    port: 3306 // porta do banco
});



app.use(session({
    secret: "dialogaSegredo123", // pode ser qualquer string segura
    resave: false,
    saveUninitialized: true,
}));

connection.connect(function(err){
    if(err){
        console.error("ERRO ", err);
        return
    } console.log("Conexão ok! ")
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/index.html")
});

app.get("/cadastre-se", function(req,res) {
    res.sendFile(__dirname + "/cadastro.html")
});

app.get("/recuperarSenha", function(req,res) {
    res.sendFile(__dirname + "/recuperacao.html")
});

app.get("/home", function(req, res) {
    const username = req.session.username || "Usuário";
    res.render("home", { username });
});

app.get("/DiarioEmocional", (req, res) => {
    const username = req.session.username;
    const userId = req.session.userId; 
    res.render("Diario", { username, userId });
});


app.get("/LerDiario", (req, res) => {
    const username = req.session.username;
    const userId = req.session.userId; 
    res.render("ListaDiario", { username, userId });
});


//FAZER DE ADMIN E DE PROFISSIONAIS
app.post("/login", function(req,res){
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    const selecionar = "SELECT * FROM usuarios WHERE nome = ? AND email=? AND senha=?"

    connection.query(selecionar, [nome, email, senha], function(err, results, fields){
        if(err){
            console.error("Erro ao entrar na conta ", err)
            res.status(500).send("ERRO interno ao verificar credenciais. ");
            return
        }if(results.length > 0){
            req.session.username = results[0].nome;
            req.session.userId = results[0].id; 
            res.redirect("/home");
        }else{
            res.render('login', {erroMessage: 'Credenciais inválidas. ', username: ""});
            return
        }
    })

});

app.post("/cadastrar", function(req, res){
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    const cadastro = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)"

    connection.query(cadastro, [nome, email, senha],function(err, result){
        if(err){
            console.error("Erro ao inserir usuario ", err)
            res.status(500).send("ERRO interno ao inserir usuario ");
            return
        }else{
            console.log("Usuário inserido com sucesso! ")
            res.redirect("/")
        }
    })

});

app.post("/recuperar", function(req, res){
    const email = req.body.email
    const senha = req.body.senha

    const recuperar = "UPDATE usuarios SET senha = ? WHERE email = ?"

    connection.query(recuperar, [senha, email], function(err,results){
        if(err){
            console.error("Erro ao recuperar senha ", err)
            res.status(500).send("ERRO interno ao recuperar senha ");
            return
        }else{
            console.log("Senha recuperada com sucesso!")
            res.redirect("/")
        }
    })
});
    
// DIario de emoçoes 
app.post("/registrarDiario", async function(req, res){
    const userId = req.session.userId;
    const texto = req.body.texto;
    const intensidade = req.body.meuSlider;

    if (!texto || intensidade === undefined || !userId) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const novoRegistro = {
        userId: parseInt(userId),
        texto,
        intensidade: parseInt(intensidade),
        date: new Date()
    };

    try {
        await client.connect(); 
        const database = client.db('DialogaDB');
        const diario = database.collection('diario');

        const resultado = await diario.insertOne(novoRegistro);
        console.log("Registro feito com sucesso!")
        res.redirect("/DiarioEmocional")

    } catch (error) {
        console.error('Erro ao inserir no diário:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o diário.' });

    } finally {
        await client.close(); 
    }
});

app.get("/LerDiario", async (req, res) => {
    const userId = req.session.userId; 
    const username = req.session.username;

    try {
        await client.connect(); 

        const resultados = await client.db("DialogaDB")
            .collection("diario")
            .find({ userId: userId })
            .toArray();

        if (resultados.length > 0) {
            res.redirect("/LerDiario")
            console.log("Consulta Realizada com sucesso")
        } else {
            res.send("<h1>Nenhum diário encontrado!</h1>");
        }
    } catch (error) {
        console.error("Erro ao buscar diários:", error);
        res.status(500).send("<h1>Erro interno do servidor</h1>");
    } finally {
        await client.close(); // fecha a conexão no final
    }
});





app.listen(8083, function(){
    console.log("Servidor rodando na url http://localhost:8083");
});

// app.listen(3000, '0.0.0.0', () => {
//     console.log("Servidor rodando na url http://192.168.100.85:3000");
// });