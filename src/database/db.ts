import { Pool } from 'pg';
import dotenv from 'dotenv';

// Configura as variáveis de ambiente
dotenv.config();

// Configura o pool de conexões
export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// teste de conexão
dbPool.connect()
  .then(() => console.log('🟢 Conectado ao PostgreSQL com sucesso!'))
  .catch((err) => console.error('🔴 Erro ao conectar ao PostgreSQL:', err));
