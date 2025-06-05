import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import atendenteRoutes from './routes/atendente.routes';
import garcomRoutes from './routes/garcom.routes';
import gerenteRoutes from './routes/gerente.routes';

// Configura as variáveis de ambiente
dotenv.config();
// Configura o servidor
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost',
  credentials: true
}));

// Rotas
app.use('/atendente', atendenteRoutes);
app.use('/garcom', garcomRoutes);
app.use('/gerente', gerenteRoutes);


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
