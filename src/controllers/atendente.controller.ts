import { Request, Response } from 'express';
import { pool } from '../database/db';

export const criarReserva = async (req: Request, res: Response) => {

  // Verifica se os campos obrigatórios foram fornecidos
  const { data, hora, numero_mesa, qtd_pessoas, nome_responsavel } = req.body;
  if (!data || !hora || !numero_mesa || !qtd_pessoas || !nome_responsavel) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  // Verifica se a data é posterior ao dia atual  
  const dataReserva = new Date(data);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Ignorar horas para comparação

  // Verifica se a data é anterior ao dia atual
  if (dataReserva < hoje) {
    return res.status(400).json({
      erro: 'Não é possível fazer reservas para datas passadas'
    });
  }

  // Verifica se o ano é anterior ao atual
  if (dataReserva.getFullYear() < hoje.getFullYear()) {
    return res.status(400).json({
      erro: 'Não é possível fazer reservas para anos anteriores'
    });
  }

  try {
    const conflito = await pool.query(
      `SELECT * FROM reservas 
       WHERE data = $1 AND hora = $2 AND numero_mesa = $3 AND status = 'reservada'`,
      [data, hora, numero_mesa]
    );

    if (conflito.rows.length > 0) {
      return res.status(400).json({ erro: 'A mesa já está reservada nesse horário.' });
    }

    await pool.query(
      `INSERT INTO reservas (data, hora, numero_mesa, qtd_pessoas, nome_responsavel) 
       VALUES ($1, $2, $3, $4, $5)`,
      [data, hora, numero_mesa, qtd_pessoas, nome_responsavel]
    );

    res.status(201).json({ mensagem: 'Reserva criada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar reserva.' });
  }
};

export const cancelarReserva = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const reserva = await pool.query(
      `SELECT * FROM reservas WHERE id = $1 AND (status = 'reservada' OR status = 'confirmada')`,
      [id]
    );

    if (reserva.rows.length === 0) {
      return res.status(404).json({ 
        erro: 'Reserva não encontrada ou já cancelada.' 
      });
    }

    // Atualizar status para 'cancelada' em vez de deletar
    await pool.query(
      `UPDATE reservas SET status = 'cancelada' WHERE id = $1`,
      [id]
    );

    res.json({ mensagem: 'Reserva cancelada com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ erro: 'Erro ao cancelar reserva.' });
  }
};