require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTableQuery = `
DROP TABLE IF EXISTS registros;
CREATE TABLE registros (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  turno VARCHAR(50) NOT NULL,
  conselheiro VARCHAR(255) NOT NULL,
  motorista VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  observacoes TEXT,
  criado_por VARCHAR(50) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  editado_em TIMESTAMP DEFAULT NULL
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
