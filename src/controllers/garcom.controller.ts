import { Request, Response } from 'express';
import { dbPool } from '../database/db';

// Confirmar reserva
export const confirmarReserva = async (req: Request, res: Response) => {
  const { numero_mesa, nome_responsavel } = req.body;

  try {

      // Atualiza a reserva
      const reserva = await dbPool.query(
          `UPDATE reservas 
           SET status = 'confirmada', nome_responsavel = $1
           WHERE id = (
               SELECT reserva_id FROM mesas WHERE numero = $2
           )
           RETURNING *`,
          [nome_responsavel, numero_mesa]
      );

      if (reserva.rows.length === 0) {
          return res.status(404).json({ 
              success: false,
              error: 'Nenhuma reserva encontrada para esta mesa' 
          });
      }

      await dbPool.query('COMMIT');
      res.json({ 
          success: true,
          message: `Reserva na mesa ${numero_mesa} confirmada com sucesso`,
          data: reserva.rows[0]
      });

  } catch (error) {
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

    // Verifica se a mesa existe e está ocupada
    const mesa = await dbPool.query(
        `SELECT * FROM mesas 
         WHERE numero = $1 AND ocupada = TRUE
         FOR UPDATE`,
        [numero_mesa]
    );

    if (mesa.rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: `Mesa ${numero_mesa} não está ocupada ou não existe`
        });
    }

    // Libera a mesa
    await dbPool.query(
        `UPDATE mesas 
         SET ocupada = FALSE, reserva_id = NULL
         WHERE numero = $1`,
        [numero_mesa]
    );

    // Atualiza o status da reserva
    await dbPool.query(
        `UPDATE reservas 
         SET status = 'finalizada'
         WHERE id = $1`,
        [mesa.rows[0].reserva_id]
    );


    res.json({
        success: true,
        message: `Mesa ${numero_mesa} liberada com sucesso`
    });

} catch (error) {
    console.error('Erro ao liberar mesa:', error);
    res.status(500).json({
        success: false,
        error: 'Erro ao liberar mesa',
    });
}
};

// Obter status das mesas
export const getMesas = async (req: Request, res: Response) => {
  try {
      const resultado = await dbPool.query(
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
