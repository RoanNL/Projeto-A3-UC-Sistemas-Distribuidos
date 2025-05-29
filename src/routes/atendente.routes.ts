import { Router } from 'express';
import { criarReserva, cancelarReserva } from '../controllers/atendente.controller';

const router = Router();

// rota para criar uma nova reserva
router.post('/reservas', async (req, res) => {
  await criarReserva(req, res);
});

// rota para cancelar uma reserva
router.post('/reservas/cancelar', async (req, res) => {
  await cancelarReserva(req, res);
});

export default router;
