const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser")

app.use(express.static("public"));

const connection = mysql.createConnection({
    host: 'localhost', //endereço do banco de dados
    user: 'root', //nome do usuario do banco
    password: 'root', // senha do banco
    database: 'DialogaDatabase', // nome do banco
    port: 3306 // porta do banco
});

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

})

app.listen(8083, function(){
    console.log("Servidor rodando na url http://localhost:8083");
});