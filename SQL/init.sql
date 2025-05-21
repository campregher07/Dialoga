
 CREATE TABLE usuarios (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nome VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       senha VARCHAR(255) NOT NULL
   );

create table denuncias(
idDenuncia  INT AUTO_INCREMENT PRIMARY KEY,
anonimo binary not null,
nome VARCHAR(255),
UF VARCHAR(2), -- dar as opcoes de UF
cidade VARCHAR(255),
Bairro VARCHAR(255),
ocorrido text not null,
quemOcorreu VARCHAR(255),
ocorreuCmg binary not null
);

delete from usuarios where id > 0;

select * from usuarios;
select * from denuncias;