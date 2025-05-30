const urlDaAPI = 'http://localhost:3000/gerente';
const formPeriodo = document.querySelector('#form-periodo');
const formMesa = document.querySelector('#form-mesa');
const formGarcom = document.querySelector('#form-garcom');

formPeriodo.addEventListener('submit', async (e) => {
  e.preventDefault();

  const inicio = document.getElementById('inicio').value;
  const fim = document.getElementById('fim').value;
 

  // Validação no frontend
  if (new Date(inicio) > new Date(fim)) {
    showMessage('A data inicial não pode ser maior que a data final', 'error');
    return;
  }


  try {
    const response = await fetch(`${urlDaAPI}/relatorio/periodo?inicio=${inicio}&fim=${fim}`);
    const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Erro ao gerar relatório');
        }

        displayPeriodReport(data);
        
    } catch (error) {
        showMessage(error.message, 'error');
        console.error('Erro:', error);
    }
});

function displayPeriodReport(reportData) {
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  if (reportData.data.length === 0) {
      resultadoDiv.innerHTML = '<p>Nenhuma reserva encontrada no período selecionado.</p>';
      return;
  }

  let html = `
      <table class="report-table">
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Mesa</th>
                  <th>Pessoas</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Ocupada</th>
              </tr>
          </thead>
          <tbody>
  `;
  
  reportData.data.forEach(reserva => {
      const statusClass = reserva.status.toLowerCase();
      const dataFormatada = new Date(reserva.data).toLocaleDateString();
      
      html += `
          <tr class="status-${statusClass}">
              <td>${reserva.id}</td>
              <td>${dataFormatada}</td>
              <td>${reserva.hora}</td>
              <td>${reserva.numero_mesa}</td>
              <td>${reserva.qtd_pessoas}</td>
              <td>${reserva.nome_responsavel}</td>
              <td>${reserva.status.toUpperCase()}</td>
              <td>${reserva.ocupada ? 'Sim' : 'Não'}</td>
          </tr>
      `;
  });
  
  html += `</tbody></table>`;
  resultadoDiv.innerHTML = html;
}

formMesa.addEventListener('submit', async (e) => {
  e.preventDefault();
  const numero = document.getElementById('numero-mesa').value;

  try {
    const response = await fetch(`${urlDaAPI}/relatorio/mesa/${numero}`);
    const data = await response.json();

    displayResult(data);
  } catch (error) {
    showMessage('Erro ao conectar com o servidor', 'error');
  }
});

formGarcom.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
      const response = await fetch(`${urlDaAPI}/relatorio/garcom`);
      const data = await response.json();

      if (!data.success) {
          throw new Error(data.error || 'Erro ao gerar relatório');
      }

      displayGarcomReport(data);
      
  } catch (error) {
      showMessage(error.message, 'error');
  }
});

function displayGarcomReport(reportData) {
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  if (Object.keys(reportData.data).length === 0) {
      resultadoDiv.innerHTML = '<p>Nenhuma reserva confirmada encontrada</p>';
      return;
  }

  let html = '<div class="report-container">';

  for (const [garcom, dados] of Object.entries(reportData.data)) {
      html += `
          <div class="garcom-section">
              <h3>${garcom} - Total de Mesas: ${dados.total}</h3>
              <table class="report-table">
                  <thead>
                      <tr>
                          <th>Data</th>
                          <th>Hora</th>
                          <th>Mesa</th>
                          <th>Pessoas</th>
                          <th>Cliente</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${dados.reservas.map(reserva => `
                          <tr>
                              <td>${new Date(reserva.data).toLocaleDateString()}</td>
                              <td>${reserva.hora}</td>
                              <td>${reserva.numero_mesa}</td>
                              <td>${reserva.qtd_pessoas}</td>
                              <td>${reserva.nome_responsavel}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          </div>
      `;
  }

  html += '</div>';
  resultadoDiv.innerHTML = html;
}

function displayResult(data) {
  const resultadoDiv = document.getElementById('resultado');
  
  if (Array.isArray(data) && data.length > 0) {
    let html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Mesa</th>
            <th>Pessoas</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Garçom</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    data.forEach(reserva => {
      // Adiciona classe CSS baseada no status
      const statusClass = reserva.status.toLowerCase();
      
      html += `
        <tr>
          <td>${reserva.id}</td>
          <td>${new Date(reserva.data).toLocaleDateString()}</td>
          <td>${reserva.hora}</td>
          <td>${reserva.numero_mesa}</td>
          <td>${reserva.qtd_pessoas}</td>
          <td>${reserva.nome_responsavel}</td>
          <td class="status-${statusClass}">${reserva.status.toUpperCase()}</td>
          <td>${reserva.garcom_responsavel || '-'}</td>
        </tr>
      `;
    });
    
    html += `</tbody></table>`;
    resultadoDiv.innerHTML = html;
  } else {
    resultadoDiv.innerHTML = `
      <div class="no-results">
        Nenhum resultado encontrado para os filtros selecionados.
      </div>
    `;
  }
}

function showMessage(message, type = 'info', duration = 5000) {
  const msgDiv = document.getElementById('mensagem');
    if (!msgDiv) return;
    
    msgDiv.textContent = message;
    msgDiv.className = `message ${type}`;
    msgDiv.style.display = 'block';

    if (duration > 0) {
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, duration);
    }
}

