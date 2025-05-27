import { Request, Response } from 'express';
import { pool } from '../database/db';

// Confirmar reserva
export const confirmarReserva = async (req: Request, res: Response) => {
  const { numero_mesa, nome_responsavel } = req.body;

  try {
      await pool.query('BEGIN');

      // Atualiza a reserva
      const reserva = await pool.query(
          `UPDATE reservas 
           SET status = 'confirmada', nome_responsavel = $1
           WHERE id = (
               SELECT reserva_id FROM mesas WHERE numero = $2
           )
           RETURNING *`,
          [nome_responsavel, numero_mesa]
      );

      if (reserva.rows.length === 0) {
          await pool.query('ROLLBACK');
          return res.status(404).json({ 
              success: false,
              error: 'Nenhuma reserva encontrada para esta mesa' 
          });
      }

      await pool.query('COMMIT');
      res.json({ 
          success: true,
          message: `Reserva na mesa ${numero_mesa} confirmada com sucesso`,
          data: reserva.rows[0]
      });

  } catch (error) {
      await pool.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ 
          success: false,
          error: 'Erro ao confirmar reserva' 
      });
  }
};

// Liberar mesa
export const liberarMesa = async (req: Request, res: Response) => {
  const { numero_mesa } = req.params;

  try {
      await pool.query('BEGIN');

      // Libera a mesa
      const result = await pool.query(
          `UPDATE mesas 
           SET ocupada = FALSE, reserva_id = NULL
           WHERE numero = $1
           RETURNING *`,
          [numero_mesa]
      );

      if (result.rows.length === 0) {
          await pool.query('ROLLBACK');
          return res.status(404).json({ erro: 'Mesa não encontrada' });
      }

      // Atualiza o status da reserva
      await pool.query(
          `UPDATE reservas 
           SET status = 'finalizada'
           WHERE id = $1`,
          [result.rows[0].reserva_id]
      );

      await pool.query('COMMIT');
      res.json({ mensagem: `Mesa ${numero_mesa} liberada com sucesso` });

  } catch (error) {
      await pool.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ erro: 'Erro ao liberar mesa' });
  }
};

// Obter status das mesas
export const getMesas = async (req: Request, res: Response) => {
  try {
      const resultado = await pool.query(
          `SELECT 
              m.numero,
              m.ocupada,
              r.status,
              r.garcom_responsavel,
              r.data,
              r.hora,
              r.nome_responsavel
           FROM mesas m
           LEFT JOIN reservas r ON m.reserva_id = r.id
           ORDER BY m.numero`
      );

      // Formata os dados para o frontend
      const mesasFormatadas = resultado.rows.map(mesa => ({
          numero_mesa: mesa.numero,
          ocupada: mesa.ocupada,
          status: mesa.status || 'livre',
          garcom: mesa.garcom_responsavel || '',
          data: mesa.data || '',
          hora: mesa.hora || '',
          cliente: mesa.nome_responsavel || ''
      }));

      res.json({
          success: true,
          data: mesasFormatadas
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ 
          success: false,
          error: 'Erro ao obter status das mesas' 
      });
  }
};
