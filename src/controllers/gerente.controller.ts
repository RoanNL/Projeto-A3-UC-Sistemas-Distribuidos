import { Request, Response } from 'express';
import { dbPool } from '../database/db';

// Reservas atendidas ou não em um período
export const relatorioPorPeriodo = async (req: Request, res: Response) => {
  const { inicio, fim} = req.query;

  // Validação das datas
  const dataInicio = new Date(inicio as string);
  const dataFim = new Date(fim as string);

  // Verifica se a data inicial é maior que a final
  if (dataInicio > dataFim) {
    return res.status(400).json({
      erro: 'A data inicial não pode ser maior que a data final'
    });
  }

  try {
    const resultado = await dbPool.query(
        `SELECT 
            r.id,
            r.data,
            r.hora,
            r.numero_mesa,
            r.qtd_pessoas,
            r.nome_responsavel,
            r.status,
            r.garcom_responsavel,
            m.ocupada
         FROM reservas r
         JOIN mesas m ON r.numero_mesa = m.numero
         WHERE r.data BETWEEN $1 AND $2
         ORDER BY r.data, r.hora`,
        [inicio, fim]
    );

    res.json({
        success: true,
        data: resultado.rows
    });

} catch (error) {
    console.error('Erro no relatório por período:', error);
    res.status(500).json({
        success: false,
        error: 'Erro ao gerar relatório'
    });
}
};

// Reservas feitas para uma determinada mesa
export const relatorioPorMesa = async (req: Request, res: Response) => {

  // Verifica se o numero da mesa foi fornecido
  const { numero } = req.params;
  try {
    const resultado = await dbPool.query(
      `SELECT * FROM reservas WHERE numero_mesa = $1`,
      [numero]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma reserva encontrada para essa mesa.' });
    }

    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar relatório da mesa.' });
  }
};

// Reservas feitas pelo cliente garçom
export const relatorioPorGarcom = async (req: Request, res: Response) => {
  const { garcom } = req.query;

  try {
      // Consulta para obter todos os garçons ativos (para o dropdown)
      const garconsAtivos = await dbPool.query(
          `SELECT nome FROM garcons WHERE ativo = TRUE ORDER BY nome`
      );

      // Consulta principal filtrada ou não por garçom
      let query = `
          SELECT 
              r.id,
              TO_CHAR(r.data, 'DD/MM/YYYY') as data_formatada,
              r.hora,
              r.numero_mesa,
              r.qtd_pessoas,
              COALESCE(r.nome_responsavel, 'Não informado') as nome_cliente,
              r.garcom_responsavel,
              g.nome as nome_garcom
          FROM reservas r
          JOIN garcons g ON r.garcom_responsavel = g.nome
          WHERE r.status = 'confirmada'
      `;

      const params = [];
      
      if (garcom && garcom !== 'todos') {
          query += ` AND r.garcom_responsavel = $1`;
          params.push(garcom);
      }

      query += ` ORDER BY r.garcom_responsavel, r.data, r.hora`;

      const resultado = await dbPool.query(query, params);

      // Formatação dos dados para o frontend
      const relatorio = {
          garcons: garconsAtivos.rows,
          reservas: resultado.rows,
          filtroAtual: garcom || 'todos'
      };

      res.json({
          success: true,
          data: relatorio
      });

  } catch (error) {
      console.error('Erro no relatório por garçom:', error);
      res.status(500).json({
          success: false,
          error: 'Erro ao gerar relatório'
      });
  }
};