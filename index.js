const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser")
const session = require("express-session");

app.use(express.static("public"));

app.set('view engine', 'ejs');


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
    res.sendFile(__dirname + "/login.html")
});

app.get("/cadastre-se", function(req,res) {
    res.sendFile(__dirname + "/cadastro.html")
});

app.get("/recuperarSenha", function(req,res) {
    res.sendFile(__dirname + "/recuperacao.html")
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
        }if(results.length>0){
            req.session.username = results[0].nome;
            res.redirect("/home" );
        }else{
            res.render('login', {erroeMessage: 'Credenciais inválidas. ', username:username});
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


app.get("/home", function(req, res) {
    const username = req.session.username || "Usuário";
    res.render("home", { username });
});


app.listen(8083, function(){
    console.log("Servidor rodando na url http://localhost:8083");
});

// app.listen(3000, '0.0.0.0', () => {
//     console.log("Servidor rodando na url http://172.20.10.2:3000");
// });