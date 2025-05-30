import { Router } from 'express';
import {
    confirmarReserva,
    getMesas,
    listarGarcons
} from '../controllers/garcom.controller';


const router = Router();

// rota para confirmar uma reserva
router.put('/reservas/confirmar', async (req, res) => {
    await confirmarReserva(req, res);
});

// rota para listar os garçons
router.get('/garcons', listarGarcons);

// rota para obter status das mesas
router.get('/mesas', getMesas);

export default router;
