import { Request, Response } from 'express';
import { dbPool } from '../database/db';

// Criar reserva
export const criarReserva = async (req: Request, res: Response) => {
  const { data, hora, numero_mesa, qtd_pessoas, nome_responsavel } = req.body;

  try {
      // Verifica se a mesa existe e está disponível
      const mesa = await dbPool.query(
          `SELECT * FROM mesas WHERE numero = $1 FOR UPDATE`,
          [numero_mesa]
      );

      if (mesa.rows.length === 0) {
          return res.status(400).json({ erro: 'Mesa inválida' });
      }

      if (mesa.rows[0].ocupada) {
          return res.status(400).json({ erro: 'Mesa já ocupada' });
      }

      // Cria a reserva
      const reserva = await dbPool.query(
          `INSERT INTO reservas 
           (data, hora, numero_mesa, qtd_pessoas, nome_responsavel, status)
           VALUES ($1, $2, $3, $4, $5, 'reservada')
           RETURNING *`,
          [data, hora, numero_mesa, qtd_pessoas, nome_responsavel]
      );

      // Atualiza o status da mesa
      await dbPool.query(
          `UPDATE mesas 
           SET ocupada = TRUE, reserva_id = $1
           WHERE numero = $2`,
          [reserva.rows[0].id, numero_mesa]
      );

      res.status(201).json(reserva.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao criar reserva' });
  }
};

// Cancelar reserva
export const cancelarReserva = async (req: Request, res: Response) => {
    const { numero_mesa } = req.body;

    try {

        // Encontra a reserva
        const reserva = await dbPool.query(
            `SELECT id FROM reservas 
             WHERE numero_mesa = $1 
             AND status = 'reservada'`,
            [numero_mesa]
        );

        if (reserva.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Nenhuma reserva encontrada para a mesa ${numero_mesa}`
            });
        }

        const reservaId = reserva.rows[0].id;

        // Libera a mesa (atualiza tabela mesas)
        await dbPool.query(
            `UPDATE mesas 
             SET ocupada = FALSE, reserva_id = NULL
             WHERE numero = $1`,
            [numero_mesa]
        );

        // Atualiza o status da reserva para cancelada
        await dbPool.query(
            `UPDATE reservas 
             SET status = 'cancelada'
             WHERE id = $1`,
            [reservaId]
        );

        res.json({
            success: true,
            message: `Reserva cancelada e mesa ${numero_mesa} liberada com sucesso`,
            data: { numero_mesa }
        });

    } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao cancelar reserva',
        });
    }
};