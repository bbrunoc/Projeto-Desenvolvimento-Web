-- Geração de Modelo físico
-- Sql ANSI 2003 - brModelo.



CREATE TABLE Usuario (
id_usuario Texto(1) PRIMARY KEY,
nome Texto(1),
email Texto(1),
publico_alvo Texto(1),
senha_hash Texto(1),
tipo_negocio Texto(1),
data_cadastro Texto(1)
)

CREATE TABLE Chatbot (
id_chatbot Texto(1) PRIMARY KEY,
nome Texto(1),
versao Texto(1),
status Texto(1)
)

CREATE TABLE Interacao (
id_interacao Texto(1) PRIMARY KEY,
data_hora Texto(1),
mensagem_usuario Texto(1),
resposta_chatbot Texto(1),
tipo_conteudo Texto(1),
avaliacao_usuario Texto(1)
)

CREATE TABLE ConteudoGerado (
id_conteudo Texto(1) PRIMARY KEY,
tipo_conteudo Texto(1),
texto_gerado Texto(1),
hashtag Texto(1),
data_criacao Texto(1)
)

CREATE TABLE Hashtag (
id_hashtag Texto(1) PRIMARY KEY,
texto Texto(1),
categoria Texto(1),
frequencia_uso Texto(1)
)

CREATE TABLE Feedback (
id_feedback Texto(1) PRIMARY KEY,
nota Texto(1),
comentario Texto(1),
data Texto(1)
)

CREATE TABLE Relação_1 (
id_interacao Texto(1),
id_usuario Texto(1),
FOREIGN KEY(id_interacao) REFERENCES Interacao (id_interacao),
FOREIGN KEY(id_usuario) REFERENCES Usuario (id_usuario)
)

CREATE TABLE Relação_2 (
id_chatbot Texto(1),
id_interacao Texto(1),
FOREIGN KEY(id_chatbot) REFERENCES Chatbot (id_chatbot),
FOREIGN KEY(id_interacao) REFERENCES Interacao (id_interacao)
)

CREATE TABLE Relação_3 (
id_conteudo Texto(1),
id_interacao Texto(1),
FOREIGN KEY(id_conteudo) REFERENCES ConteudoGerado (id_conteudo),
FOREIGN KEY(id_interacao) REFERENCES Interacao (id_interacao)
)

CREATE TABLE Relação_4 (
id_hashtag Texto(1),
id_conteudo Texto(1),
FOREIGN KEY(id_hashtag) REFERENCES Hashtag (id_hashtag),
FOREIGN KEY(id_conteudo) REFERENCES ConteudoGerado (id_conteudo)
)

CREATE TABLE Relação_5 (
id_feedback Texto(1),
id_usuario Texto(1),
FOREIGN KEY(id_feedback) REFERENCES Feedback (id_feedback)/*falha: chave estrangeira*/
)

