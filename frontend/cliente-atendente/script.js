const urlDaAPI = 'http://localhost:3000/atendente';
const formReserva = document.querySelector('#form-reserva');
const formCancel = document.querySelector('#form-cancelar');

// Evento de envio do formulário
formReserva.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dataInput = document.querySelector('#data').value; 
    const horaInput = document.querySelector('#hora').value; 

    if (!dataInput || !horaInput) {
        showMessage('Por favor, selecione a data e a hora.', 'error');
        return;
    }

    // Junta a data e a hora no formato ISO
    const dataHoraStr = `${dataInput}T${horaInput}`;

    const dataReserva = new Date(dataHoraStr);
    const agora = new Date();

    
    if (dataReserva.getTime() < agora.getTime()) {
        showMessage('Não é possível fazer reservas para datas e horas passadas ou iguais à atual.', 'error');
        return;
    }

    if (dataReserva.getTime() < agora.getTime() + 15 * 60 * 1000) {
        showMessage('Reservas podem ser feitas com no mínimo 15 minutos de antecedência.', 'error');
        return;
    }

    const reserva = {
        data: document.querySelector('#data').value,
        hora: document.querySelector('#hora').value,
        numero_mesa: document.querySelector('#numero-mesa').value,
        qtd_pessoas: document.querySelector('#qtd-pessoas').value,
        nome_responsavel: document.querySelector('#nome-responsavel').value
    };

    if (!reserva.data || !reserva.hora || !reserva.numero_mesa || !reserva.qtd_pessoas || !reserva.nome_responsavel) {
        showMessage('Preencha todos os campos', 'error');
        return;
    }

    if (reserva.qtd_pessoas <= 0) {
        showMessage('Quantidade de pessoas deve ser maior que zero', 'error');
        return;
    }

    const regex = /\p{L}+/gu;
    if (!regex.test(reserva.nome_responsavel)) {
        showMessage('Insira um nome válido', 'error');
        return;
    }

    if (reserva.nome_responsavel.startsWith(' ') || reserva.nome_responsavel.endsWith(' ')) {
        showMessage('O nome nao pode iniciar ou terminar com espaços', 'error');
        return;
    }

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