import { Request, Response } from 'express';
import { dbPool } from '../database/db';

// Confirmar reserva
export const confirmarReserva = async (req: Request, res: Response) => {
    const { numero_mesa, garcom_id } = req.body;

    try {

        const garcom = await dbPool.query(
            `SELECT nome FROM garcons WHERE id = $1 AND ativo = TRUE`,
            [garcom_id]
        );

        if (garcom.rows.length === 0) {
            return res.status(400).json({ 
                success: false,
                erro: 'Garçom inválido ou inativo' 
            });
        }

        const nomeGarcom = garcom.rows[0].nome;


        // Verifica se a reserva existe e está com status 'reservada'
        const reserva = await dbPool.query(
            `SELECT id FROM reservas 
             WHERE numero_mesa = $1
             AND status = 'reservada'
             FOR UPDATE`,
            [numero_mesa] 
        );

        if (reserva.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                erro: 'Nenhuma reserva encontrada ou já confirmada' 
            });
        }

        const reservaId = reserva.rows[0].id;

        // Atualiza a reserva
        await dbPool.query(
            `UPDATE reservas 
             SET status = 'confirmada',
                 garcom_responsavel = $1
             WHERE id = $2`,
            [nomeGarcom, reservaId]
        );

        // Atualiza a mesa
        await dbPool.query(
            `UPDATE mesas 
             SET ocupada = FALSE,
                 reserva_id = $1
             WHERE numero = $2`,
            [reservaId, numero_mesa]
        );

        res.json({ 
            success: true,
            message: `Reserva confirmada para mesa ${numero_mesa} pelo garçom ${nomeGarcom}!`,
            data: { numero_mesa, status: 'confirmada' }
        });

    } catch (error) {
        console.error('Erro ao confirmar reserva:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao confirmar reserva' 
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

// Listar garçons
export const listarGarcons = async (req: Request, res: Response) => {
    try {
        const resultado = await dbPool.query(
            `SELECT id, nome FROM garcons WHERE ativo = TRUE ORDER BY nome`
        );

        res.json({
            success: true,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Erro ao listar garçons:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao listar garçons'
        });
    }
};
