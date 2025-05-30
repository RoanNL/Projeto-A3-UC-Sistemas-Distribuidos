-- cria a tabela de garçons (sem dependências)
CREATE TABLE IF NOT EXISTS garcons (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de reservas (sem a FK para mesas ainda)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cria a tabela de mesas 
CREATE TABLE IF NOT EXISTS mesas (
    numero INTEGER PRIMARY KEY CHECK (numero BETWEEN 1 AND 20),
    ocupada BOOLEAN NOT NULL DEFAULT FALSE,
    reserva_id INTEGER,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL
);

-- Adiciona a FK de reservas para mesas
ALTER TABLE reservas ADD CONSTRAINT fk_reservas_mesa 
    FOREIGN KEY (numero_mesa) REFERENCES mesas(numero);

-- Adiciona a FK para garçons 
ALTER TABLE reservas ADD CONSTRAINT fk_reservas_garcom 
    FOREIGN KEY (garcom_responsavel) REFERENCES garcons(nome) ON DELETE SET NULL;

-- Insere as 20 mesas iniciais
INSERT INTO mesas (numero)
SELECT generate_series(1, 21)
ON CONFLICT (numero) DO NOTHING;

-- Inserção de garçons padrão
INSERT INTO garcons (nome) VALUES 
('Roan Lisboa'),
('Catarina Romeiro'),
('Alice Bahianense'),
('Eduardo Copque')
ON CONFLICT (nome) DO NOTHING;

-- Cria os índices
CREATE INDEX IF NOT EXISTS idx_reservas_data ON reservas(data);
CREATE INDEX IF NOT EXISTS idx_reservas_status ON reservas(status);
CREATE INDEX IF NOT EXISTS idx_reservas_mesa ON reservas(numero_mesa);
CREATE INDEX IF NOT EXISTS idx_reservas_garcom ON reservas(garcom_responsavel);
CREATE INDEX IF NOT EXISTS idx_garcons_nome ON garcons(nome);
CREATE INDEX IF NOT EXISTS idx_mesas_reserva ON mesas(reserva_id);
