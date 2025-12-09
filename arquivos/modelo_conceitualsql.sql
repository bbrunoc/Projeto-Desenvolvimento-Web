CREATE TABLE "Usuario" (
  "id_usuario" varchar PRIMARY KEY,
  "nome" varchar,
  "email" varchar,
  "senha_hash" varchar,
  "tipo_negocio" varchar,
  "publico_alvo" varchar,
  "data_cadastro" date
);

CREATE TABLE "Chatbot" (
  "id_chatbot" varchar PRIMARY KEY,
  "nome" varchar,
  "versao" varchar,
  "status" boolean
);

CREATE TABLE "Interacao" (
  "id_interacao" varchar PRIMARY KEY,
  "id_usuario" varchar,
  "id_chatbot" varchar,
  "data_hora" datetime,
  "mensagem_usuario" text,
  "resposta_chatbot" text,
  "tipo_conteudo" varchar,
  "avaliacao_usuario" int
);

CREATE TABLE "ConteudoGerado" (
  "id_conteudo" varchar PRIMARY KEY,
  "id_interacao" varchar,
  "tipo_conteudo" varchar,
  "texto_gerado" text,
  "data_criacao" datetime
);

CREATE TABLE "Hashtag" (
  "id_hashtag" varchar PRIMARY KEY,
  "texto" varchar,
  "categoria" varchar,
  "frequencia_uso" int
);

CREATE TABLE "ConteudoHashtag" (
  "id_conteudo" varchar,
  "id_hashtag" varchar
);

CREATE TABLE "Feedback" (
  "id_feedback" varchar PRIMARY KEY,
  "id_usuario" varchar,
  "id_conteudo" varchar,
  "nota" int,
  "comentario" text,
  "data" datetime
);

ALTER TABLE "Interacao" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id_usuario");

ALTER TABLE "Interacao" ADD FOREIGN KEY ("id_chatbot") REFERENCES "Chatbot" ("id_chatbot");

ALTER TABLE "ConteudoGerado" ADD FOREIGN KEY ("id_interacao") REFERENCES "Interacao" ("id_interacao");

ALTER TABLE "ConteudoHashtag" ADD FOREIGN KEY ("id_conteudo") REFERENCES "ConteudoGerado" ("id_conteudo");

ALTER TABLE "ConteudoHashtag" ADD FOREIGN KEY ("id_hashtag") REFERENCES "Hashtag" ("id_hashtag");

ALTER TABLE "Feedback" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id_usuario");

ALTER TABLE "Feedback" ADD FOREIGN KEY ("id_conteudo") REFERENCES "ConteudoGerado" ("id_conteudo");

ALTER TABLE "Usuario" ADD FOREIGN KEY ("email") REFERENCES "Usuario" ("senha_hash");
