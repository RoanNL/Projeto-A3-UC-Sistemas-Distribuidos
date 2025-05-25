import { Router } from 'express';
import {
    confirmarReserva,
    liberarMesa,
    getMesas,
    cadastrarGarcom,
    listarGarcons 
} from '../controllers/garcom.controller';

import { excluirGarcom } from '../controllers/gerente.controller';

const router = Router();

// rota para confirmar uma reserva
router.put('/reservas/:id/confirmar', async (req, res) => {
    await confirmarReserva(req, res);
});

// rota para liberar uma mesa
router.put('/mesas/:numero_mesa/liberar', liberarMesa);

// rota para obter status das mesas
router.get('/mesas', getMesas);

// rota para cadastrar um novo garcom
router.post('/garcons', async (req, res) => {
    await cadastrarGarcom(req, res);
});

// rota para listar todos os garcons
router.get('/garcons', listarGarcons);

// rota para excluir um garcom
router.delete('/garcons/:id', async (req, res) => {
    await excluirGarcom(req, res);
});

export default router;