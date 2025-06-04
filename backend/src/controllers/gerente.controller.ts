import { Request, Response } from 'express';
import { dbPool } from '../database/db';

// Reservas atendidas ou não em um período
export const relatorioPorPeriodo = async (req: Request, res: Response) => {
  const { inicio, fim } = req.query;

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

    const resumo = {
      total: resultado.rows.length,
      confirmadas: resultado.rows.filter(r => r.status === 'confirmada').length,
      canceladas: resultado.rows.filter(r => r.status === 'cancelada').length
    };

    res.json({
      success: true,
      data: resultado.rows,
      resumo: resumo
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
      `SELECT 
        r.id,
        r.data,
        r.hora,
        r.numero_mesa,
        r.qtd_pessoas,
        r.nome_responsavel,
        r.status,
        r.garcom_responsavel
       FROM reservas r
       WHERE r.numero_mesa = $1
       ORDER BY r.data DESC`,
      [numero]
    );

    // Adiciona o resumo estatístico
    const resumo = {
      total: resultado.rows.length,
      confirmadas: resultado.rows.filter(r => r.status === 'confirmada').length,
      canceladas: resultado.rows.filter(r => r.status === 'cancelada').length,
      outras: resultado.rows.filter(r => !['confirmada', 'cancelada'].includes(r.status)).length
    };

    res.json({
      success: true,
      data: resultado.rows,
      resumo: resumo
    });

  } catch (error) {
    console.error('Erro no relatório por mesa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório da mesa'
    });
  }
};

// Reservas feitas pelo cliente garçom
export const relatorioPorGarcom = async (req: Request, res: Response) => {
  const { garcom } = req.query;

  try {
      // Obter lista de garçons
      const garconsResult = await dbPool.query(
          `SELECT nome FROM garcons WHERE ativo = TRUE ORDER BY nome`
      );
      const garcons = garconsResult.rows;

      // Obter reservas
      let query = `
          SELECT 
              r.data,
              r.hora,
              r.numero_mesa,
              r.qtd_pessoas,
              r.nome_responsavel,
              r.status,
              r.garcom_responsavel
          FROM reservas r
          WHERE r.status = 'confirmada'
      `;
      
      const params = [];
      if (garcom && garcom !== 'todos') {
          query += ` AND r.garcom_responsavel = $1`;
          params.push(garcom);
      }
      
      query += ` ORDER BY r.data, r.hora`;
      
      const reservasResult = await dbPool.query(query, params);
      const reservas = reservasResult.rows;

      // Calcular totais por garçom
      const totalPorGarcom = garcons.map(g => ({
          nome: g.nome,
          total: reservas.filter(r => r.garcom_responsavel === g.nome).length
      }));

      res.json({
          success: true,
          data: {
              garcons,
              reservas,
              totalPorGarcom,
              filtroAtual: garcom || 'todos'
          }
      });

  } catch (error) {
      console.error('Erro no relatório por garçom:', error);
      res.status(500).json({
          success: false,
          error: 'Erro ao gerar relatório'
      });
  }
};