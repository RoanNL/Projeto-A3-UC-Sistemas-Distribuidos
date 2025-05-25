-- Criação do banco de dados (execute separadamente se necessário)
-- CREATE DATABASE restaurant_reservations;

-- Conecte ao banco de dados
-- \c restaurant_reservations

-- Tabela de garçons
CREATE TABLE IF NOT EXISTS garcons (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    numero_mesa INTEGER NOT NULL CHECK (numero_mesa BETWEEN 1 AND 20),
    qtd_pessoas INTEGER NOT NULL CHECK (qtd_pessoas > 0),
    nome_responsavel VARCHAR(100) NOT NULL,
    garcom_responsavel VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'reservada' 
        CHECK (status IN ('reservada', 'confirmada', 'cancelada')),
    mesa_ocupada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (garcom_responsavel) REFERENCES garcons(nome) ON DELETE SET NULL
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_reservas_data ON reservas(data);
CREATE INDEX IF NOT EXISTS idx_reservas_status ON reservas(status);
CREATE INDEX IF NOT EXISTS idx_reservas_mesa ON reservas(numero_mesa);
CREATE INDEX IF NOT EXISTS idx_reservas_garcom ON reservas(garcom_responsavel);
CREATE INDEX IF NOT EXISTS idx_garcons_nome ON garcons(nome);

-- Dados iniciais
INSERT INTO garcons (nome) VALUES 
('Roan'),
('Alice'),
('Eduardo'),
('Catarina'),
ON CONFLICT (nome) DO NOTHING;

-- Visualização para relatórios 
CREATE OR REPLACE VIEW view_reservas_completas AS
SELECT 
    r.id,
    r.data,
    r.hora,
    r.numero_mesa,
    r.qtd_pessoas,
    r.nome_responsavel,
    r.garcom_responsavel,
    r.status,
    r.mesa_ocupada,
    g.ativo AS garcom_ativo
FROM 
    reservas r
LEFT JOIN 
    garcons g ON r.garcom_responsavel = g.nome;