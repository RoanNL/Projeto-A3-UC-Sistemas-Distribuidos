const API_BASE_URL = 'http://localhost:3000/garcom';
let mesasData = [];

// Função para carregar o status das mesas
async function carregarMesas() {
    try {
        const response = await fetch(`${API_BASE_URL}/mesas`);
        const { success, data: mesas, error } = await response.json();

        if (!success) {
            throw new Error(error || 'Erro ao carregar mesas');
        }

        const container = document.getElementById('mesas-container');
        container.innerHTML = '';

        mesas.forEach(mesa => {
            const mesaElement = document.createElement('div');
            mesaElement.className = `mesa ${mesa.ocupada ? 'ocupada' : ''}`;
            mesaElement.id = `mesa-${mesa.numero_mesa}`;
            
            let infoReserva = '';
            if (mesa.ocupada) {
                infoReserva = `
                    <div class="info-reserva">
                        <p>Cliente: ${mesa.cliente}</p>
                        <p>${mesa.data} às ${mesa.hora}</p>
                        <p>Status: ${mesa.status.toUpperCase()}</p>
                        ${mesa.status === 'confirmada' ? 
                          `<button onclick="liberarMesa(${mesa.numero_mesa})">Liberar Mesa</button>` : ''}
                    </div>
                `;
            }

            mesaElement.innerHTML = `
                <div class="mesa-header">
                    <h3>Mesa ${mesa.numero_mesa}</h3>
                    <span>${mesa.ocupada ? 'OCUPADA' : 'LIVRE'}</span>
                </div>
                ${infoReserva}
            `;

            container.appendChild(mesaElement);
        });

    } catch (error) {
        console.error('Erro:', error);
        showMessage(error.message, 'error');
    }
}

function showMessage(message, type) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.textContent = message;
    msgDiv.className = `message ${type}`;
    msgDiv.style.display = 'block';

    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
}

// Função para liberar mesa
window.liberarMesa = async (numeroMesa) => {
    if (confirm(`Liberar mesa ${numeroMesa}?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/mesas/${numeroMesa}/liberar`, {
                method: 'PUT'
            });

            const { success, message, error } = await response.json();

            if (!success) {
                throw new Error(error || 'Erro ao liberar mesa');
            }

            showMessage(message, 'success');
            carregarMesas();
        } catch (error) {
            showMessage(error.message, 'error');
        }
    }
};

// Confirmar reserva 
document.getElementById('form-confirmar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const numeroMesa = document.getElementById('numero-mesa').value;
    const nomeGarcom = document.getElementById('nome-garcom').value;

    try {
        const response = await fetch(`${API_BASE_URL}/reservas/confirmar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero_mesa: numeroMesa,
                nome_responsavel: nomeGarcom
            })
        });

        const { success, message, error } = await response.json();

        if (!success) {
            throw new Error(error || 'Erro ao confirmar reserva');
        }

        showMessage(message, 'success');
        document.getElementById('form-confirmar').reset();
        carregarMesas();
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

function showMessage(message, type) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.textContent = message;
    msgDiv.className = type;
    msgDiv.style.display = 'block';

    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
}

// Carrega as mesas inicialmente e a cada 10 segundos
carregarMesas();
setInterval(carregarMesas, 10000); // Atualiza a cada 10 segundos