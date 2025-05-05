
 CREATE TABLE usuarios (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nome VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       senha VARCHAR(255) NOT NULL
   );


CREATE TABLE diario_emocoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- ID do usuário autenticado
    texto TEXT NOT NULL,  -- Mensagem escrita
    emocao VARCHAR(50) NOT NULL, -- Emoção selecionada
    intensidade INT NOT NULL, -- Intensidade do slider
    data DATETIME NOT NULL, -- Data do registro
    FOREIGN KEY (user_id) REFERENCES usuarios(id) -- Associa à tabela de usuários
);

delete from usuarios where id > 0;