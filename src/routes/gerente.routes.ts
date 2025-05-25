import { Router } from 'express';
import {
  relatorioPorPeriodo,
  relatorioPorMesa,
  relatorioPorGarcom,
  cadastrarGarcom,
  listarGarcons,
  excluirGarcom
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
router.get('/relatorio/garcom/:nome', async (req, res) => {
  await relatorioPorGarcom(req, res);
});

// rota para cadastrar um novo garcom
router.post('/garcons', async (req, res) => {
  await cadastrarGarcom(req, res);
});

// rota para excluir um garcom
router.delete('/garcons/:id', async (req, res) => {
  await excluirGarcom(req, res);
});

// rota para listar todos os garcons
router.get('/garcons', listarGarcons);

export default router;
