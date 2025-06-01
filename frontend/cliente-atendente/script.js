const urlDaAPI = 'http://localhost:3000/atendente';
const formReserva = document.querySelector('#form-reserva');
const formCancel = document.querySelector('#form-cancelar');

// Evento de envio do formulário
formReserva.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dataInput = document.querySelector('#data').value;
    const dataReserva = new Date(dataInput);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Validação no frontend
    if (dataReserva < hoje) {
        showMessage('Não é possível fazer reservas para datas passadas', 'error');
        return;
    }

    if (dataReserva.getFullYear() < hoje.getFullYear()) {
        showMessage('Não é possível fazer reservas para anos anteriores', 'error');
        return;
    }

    const reserva = {
        data: document.querySelector('#data').value,
        hora: document.querySelector('#hora').value,
        numero_mesa: document.querySelector('#numero-mesa').value,
        qtd_pessoas: document.querySelector('#qtd-pessoas').value,
        nome_responsavel: document.querySelector('#nome-responsavel').value
    };

    try {
        const response = await fetch(`${urlDaAPI}/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Reserva realizada com sucesso', 'success');
            document.querySelector('#form-reserva').reset();
        } else {
            showMessage(data.erro, 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
});

// Evento de envio do formulário
formCancel.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.querySelector('#id-reserva').value;

    try {
        const response = await fetch(`${urlDaAPI}/reservas/cancelar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numero_mesa: id })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Erro ao cancelar reserva');
        }

        showMessage(result.message, 'success');
        document.getElementById('form-cancelar').reset();

        // Atualiza a visualização das mesas se estiver na tela do garçom
        if (typeof carregarMesas === 'function') {
            carregarMesas();
        }

    } catch (error) {
        showMessage(error.message, 'error');
        console.error('Erro:', error);
    }
});

// Função para exibir mensagens
function showMessage(message, type) {
    const msgDiv = document.querySelector('#mensagem');
    msgDiv.textContent = message;
    msgDiv.className = type;
}