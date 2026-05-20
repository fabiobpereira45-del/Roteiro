require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_zEedHTI0c8rN@ep-withered-waterfall-aqdcvaj1-pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

// GET /api/registros - Listar todos os registros
app.get('/api/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

// POST /api/registros - Criar novo registro
app.post('/api/registros', async (req, res) => {
  const { data, turno, conselheiro, motorista, destino, observacoes, criado_por } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO registros (data, turno, conselheiro, motorista, destino, observacoes, criado_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data, turno, conselheiro, motorista, destino, observacoes, criado_por || 'system']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar registro' });
  }
});

// PUT /api/registros/:id - Atualizar um registro
app.put('/api/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { data, turno, conselheiro, motorista, destino, observacoes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE registros 
       SET data = $1, turno = $2, conselheiro = $3, motorista = $4, destino = $5, observacoes = $6
       WHERE id = $7 RETURNING *`,
      [data, turno, conselheiro, motorista, destino, observacoes, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar registro' });
  }
});

// DELETE /api/registros/:id - Deletar um registro
app.delete('/api/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM registros WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    res.json({ message: 'Registro deletado com sucesso', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar registro' });
  }
});

module.exports = app;
