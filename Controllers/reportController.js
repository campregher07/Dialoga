const connection = require('../db/mysql');

exports.Denunciar =  (req, res) => {
    const anonimo = req.body.anonimo;
    const nome = req.body.nome;
    const uf = req.body.uf;
    const cidade = req.body.cidade;
    const bairro = req.body.bairro;
    const tipoDenuncia = req.body.tipoDenuncia;
    const ocorrido = req.body.ocorrido;

 
     const insert = "INSERT INTO denuncias (anonimo, nome, UF, cidade, Bairro,TipoDenuncia, ocorrido) VALUES (?)";
     const values = [anonimo, nome, uf, cidade, bairro,tipoDenuncia, ocorrido];

     connection.query(insert, [values], function(err, results){
        if(err){
            console.error('Erro ao fazer denúncia:', err);
            res.status(500).json({ error: 'Erro interno ao fazer denúncia.' });
        }

        console.log("Denuncia feita com sucesso")
        res.redirect("/home")
     });
};
