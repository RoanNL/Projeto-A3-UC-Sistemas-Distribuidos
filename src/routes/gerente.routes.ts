import { Router } from 'express';
import {
  relatorioPorPeriodo,
  relatorioPorMesa,
  relatorioPorGarcom,
} from '../controllers/gerente.controller';

const router = Router();

// rota para pegar as reservas por periodo
router.get('/relatorio/periodo', async (req, res) => {
  await relatorioPorPeriodo(req, res);
});

// rota para pegar as reservas por mesa
router.get('/relatorio/mesa/:numero', async (req, res) => {
  await relatorioPorMesa(req, res);
});

// rota para pegar as reservas por garcom
router.get('/relatorio/garcom', async (req, res) => {
  await relatorioPorGarcom(req, res);
});


export default router;
