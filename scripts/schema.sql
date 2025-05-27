-- Tabela de garçons
CREATE TABLE IF NOT EXISTS garcons (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nova tabela de mesas
CREATE TABLE IF NOT EXISTS mesas (
    numero INTEGER PRIMARY KEY CHECK (numero BETWEEN 1 AND 20),
    ocupada BOOLEAN NOT NULL DEFAULT FALSE,
    reserva_id INTEGER,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL
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
        CHECK (status IN ('reservada', 'confirmada', 'cancelada', 'finalizada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (garcom_responsavel) REFERENCES garcons(nome) ON DELETE SET NULL,
    FOREIGN KEY (numero_mesa) REFERENCES mesas(numero)
);


-- Índices atualizados
CREATE INDEX IF NOT EXISTS idx_reservas_data ON reservas(data);
CREATE INDEX IF NOT EXISTS idx_reservas_status ON reservas(status);
CREATE INDEX IF NOT EXISTS idx_reservas_mesa ON reservas(numero_mesa);
CREATE INDEX IF NOT EXISTS idx_reservas_garcom ON reservas(garcom_responsavel);
CREATE INDEX IF NOT EXISTS idx_garcons_nome ON garcons(nome);
CREATE INDEX IF NOT EXISTS idx_mesas_reserva ON mesas(reserva_id);

-- Visualização atualizada para relatórios
CREATE OR REPLACE VIEW view_reservas_completas AS
SELECT 
    r.id,
    r.data,
    r.hora,
    r.numero_mesa,
    m.ocupada,
    r.qtd_pessoas,
    r.nome_responsavel,
    r.garcom_responsavel,
    r.status,
    g.ativo AS garcom_ativo
FROM 
    reservas r
JOIN
    mesas m ON r.numero_mesa = m.numero
LEFT JOIN 
    garcons g ON r.garcom_responsavel = g.nome;
