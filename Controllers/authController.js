const connection = require('../db/mysql');

exports.login = (req, res) => {
    const { nome, email, senha } = req.body;
    const query = "SELECT * FROM usuarios WHERE nome = ? AND email=? AND senha=?";
    
    connection.query(query, [nome, email, senha], (err, results) => {
        if (err) return res.status(500).send("Erro ao verificar login");
        
        if (results.length > 0) {
            req.session.username = results[0].nome;
            req.session.userId = results[0].id;
            return res.redirect("/home");
        } else {
            return res.render('login', { erroMessage: 'Credenciais inválidas.', username: "" });
        }
    });
};

exports.cadastrar  = (req, res) => {
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
};

exports.recuperar = (req, res) => {
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
};