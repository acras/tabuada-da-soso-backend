const express = require("express");
const fs = require("fs"); // Para ler e escrever arquivos
const path = require("path"); // Para lidar com caminhos de arquivo
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tabuada",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

app.post("/api/score", (req, res) => {
  const { name, level, score } = req.body;
  const query = "INSERT INTO rankings (name, level, score) VALUES (?, ?, ?)";

  connection.query(query, [name, level, score], (err, results) => {
    if (err) {
      console.error("Erro ao inserir pontuação:", err);
      res.status(500).send("Erro ao registrar a pontuação");
    } else {
      res.status(200).send("Pontuação registrada com sucesso");
    }
  });
});

app.get("/api/ranking/:level", (req, res) => {
  const level = req.params.level;
  const query =
    "SELECT name, score FROM rankings WHERE level = ? ORDER BY score DESC LIMIT 10";

  connection.query(query, [level], (err, results) => {
    if (err) {
      console.error("Erro ao buscar ranking:", err);
      res.status(500).send("Erro ao buscar o ranking");
    } else {
      res.json(results);
    }
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
