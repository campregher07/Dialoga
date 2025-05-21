
exports.Denunciar =  (req, res) => {
    const anonimo = req.body.anonimo;
    const nome = req.body.nome;
    const uf = req.body.uf;
    const cidade = req.body.cidade;
    const bairro = req.body.bairro;
    const ocorreuCmg = req.body.ocorreuCmg;
    const quemOcorreu = req.body.quemOcorreu;
    const ocorrido = req.body.ocorrido;
 
     const insert = "INSERT INTO denuncias (anonimo, nome, UF, cidade, Bairro, quemOcorreu, ocorreuCmg, ocorrido) VALUES (?)";
     const values = [anonimo, nome, uf, cidade, bairro, quemOcorreu, ocorreuCmg, ocorrido];

     connection.query(insert, [values], function(err, results){
        if(err){
            console.error('Erro ao fazer denúncia:', err);
            res.status(500).json({ error: 'Erro interno ao fazer denúncia.' });
        }

        console.log("Denuncia feita com sucesso")
        res.redirect("/home")
     });
};
