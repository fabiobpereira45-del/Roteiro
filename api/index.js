require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
  const { data, hora_saida, hora_retorno, conselheiro, motorista, destino, finalidade, observacoes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO registros (data, hora_saida, hora_retorno, conselheiro, motorista, destino, finalidade, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [data, hora_saida, hora_retorno || null, conselheiro, motorista, destino, finalidade, observacoes]
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
  const { data, hora_saida, hora_retorno, conselheiro, motorista, destino, finalidade, observacoes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE registros 
       SET data = $1, hora_saida = $2, hora_retorno = $3, conselheiro = $4, motorista = $5, destino = $6, finalidade = $7, observacoes = $8
       WHERE id = $9 RETURNING *`,
      [data, hora_saida, hora_retorno || null, conselheiro, motorista, destino, finalidade, observacoes, id]
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
