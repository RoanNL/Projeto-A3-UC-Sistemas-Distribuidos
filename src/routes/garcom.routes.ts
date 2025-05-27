import { Router } from 'express';
import {
    confirmarReserva,
    liberarMesa,
    getMesas,
} from '../controllers/garcom.controller';


const router = Router();

// rota para confirmar uma reserva
router.put('/reservas/confirmar', async (req, res) => {
    await confirmarReserva(req, res);
});

// rota para liberar uma mesa
router.put('/mesas/:numero_mesa/liberar', async (req, res) => {
    await liberarMesa(req, res)
});

// rota para obter status das mesas
router.get('/mesas', getMesas);

export default router;
