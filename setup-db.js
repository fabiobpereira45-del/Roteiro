require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS registros (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  hora_saida TIME NOT NULL,
  hora_retorno TIME,
  conselheiro VARCHAR(255) NOT NULL,
  motorista VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  finalidade VARCHAR(255) NOT NULL,
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(createTableQuery)
  .then(() => {
    console.log("Tabela 'registros' criada com sucesso!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Erro ao criar tabela:", err);
    process.exit(1);
  });
