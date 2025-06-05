const urlDaAPI = 'http://localhost:3000/garcom';
let mesasData = [];
let garconsDisponiveis = [];
let refreshInterval;
const confReserva = document.querySelector('#form-confirmar');


// Confirmar reserva 
confReserva.addEventListener('submit', async (e) => {
    e.preventDefault();

    const numeroMesa = document.querySelector('#numero-mesa').value;
    const garcomId = document.querySelector('#select-garcom').value;

    if (!garcomId) {
        showMessage('Selecione seu nome na lista de garçons', 'error');
        return;
    }

    try {
        const response = await fetch(`${urlDaAPI}/reservas/confirmar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero_mesa: numeroMesa,
                garcom_id: garcomId
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Reserva para essa mesa não foi realizada!');
        }

        showMessage(result.message, 'success');
        document.querySelector('#form-confirmar').reset();
        await carregarMesas();

    } catch (error) {
        showMessage(error.message, 'error');
        console.error('Erro:', error);
    }
});

// Função para carregar o status das mesas
async function carregarMesas() {
    try {
        const response = await fetch(`${urlDaAPI}/mesas`);
        const { success, data: mesas, error } = await response.json();

        if (!success) {
            throw new Error(error || 'Erro ao carregar mesas');
        }

        const container = document.querySelector('#mesas-container');
        container.innerHTML = '';

        mesas.forEach(mesa => {
            const mesaElement = document.createElement('div');
            mesaElement.className = `mesa ${mesa.ocupada ? 'ocupada' : ''}`;
            mesaElement.id = `mesa-${mesa.numero_mesa}`;
            const horaFormatada = mesa.hora
        ? mesa.hora.substring(0, 5)
        : '--:--';


            let infoReserva = '';
            
            if (mesa.ocupada) {
                infoReserva = `
                    <div class="info-reserva">
                        <p>Cliente: ${mesa.cliente}</p>
                        <p>${formatarData(mesa.data)} às ${horaFormatada}</p>
                        <p>Status: ${mesa.status.toUpperCase()}</p>
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

// Função para exibir mensagens
function showMessage(message, type) {
    const msgDiv = document.querySelector('#mensagem');
    msgDiv.textContent = message;
    msgDiv.className = `message ${type}`;
    msgDiv.style.display = 'block';

    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
}

// Função para formatar a data no padrão abrasileirado
function formatarData(dataISO) {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
}

// Chama a função de carregar mesas ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarMesas();
    carregarGarcons();
    refreshInterval = setInterval(carregarMesas, 10000);
});

// Carrega a lista de garçons disponíveis
async function carregarGarcons() {
    try {
        const response = await fetch(`${urlDaAPI}/garcons`);
        const { success, data, error } = await response.json();
        
        if (!success) throw new Error(error || 'Erro ao carregar garçons');
        
        garconsDisponiveis = data;
        atualizarSelectGarcons();
    } catch (error) {
        console.error('Erro ao carregar garçons:', error);
        showMessage('Erro ao carregar lista de garçons', 'error');
    }
}

// Preenche o select com os garçons
function atualizarSelectGarcons() {
    const select = document.querySelector('#select-garcom');
    
    // Limpa opções existentes, mantendo a primeira
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Adiciona os garçons disponíveis
    garconsDisponiveis.forEach(garcom => {
        const option = document.createElement('option');
        option.value = garcom.id;
        option.textContent = garcom.nome;
        select.appendChild(option);
    });
}

// Carrega as mesas inicialmente e a cada 10 segundos
carregarMesas();
setInterval(carregarMesas, 10000); 
