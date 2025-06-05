const urlDaAPI = 'http://localhost:3000/gerente';
const formPeriodo = document.querySelector('#form-periodo');
const formMesa = document.querySelector('#form-mesa');
const formGarcom = document.querySelector('#form-garcom');

// Evento de envio do formulário por período
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
    alert('Relatório gerado com sucesso!');

  } catch (error) {
    showMessage(error.message, 'error');
    console.error('Erro:', error);
  }
});

// Função para exibir relatório por período
function displayPeriodReport(reportData) {
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  // Verifica se há dados
  if (!reportData.data || reportData.data.length === 0) {
    resultadoDiv.innerHTML = '<p class="no-results">Nenhuma reserva encontrada no período selecionado.</p>';
    return;
  }

  // Cria o cabeçalho do relatório
  let html = `
      <div class="report-container">
          <div class="report-header">
              <h3>Relatório do Período</h3>
              <div class="report-summary">
                  <div class="report-summary-item report-summary-total">
                      Total: ${reportData.resumo?.total || 0}
                  </div>
                  <div class="report-summary-item report-summary-confirmed">
                      Confirmadas: ${reportData.resumo?.confirmadas || 0}
                  </div>
                  <div class="report-summary-item report-summary-cancelled">
                      Canceladas: ${reportData.resumo?.canceladas || 0}
                  </div>
              </div>
          </div>
          
          <table class="report-table">
              <thead>
                  <tr>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Mesa</th>
                      <th>Pessoas</th>
                      <th>Cliente</th>
                      <th>Status</th>
                      <th>Garçom</th>
                  </tr>
              </thead>
              <tbody>
  `;

  // Preenche a tabela com os dados
  reportData.data.forEach(reserva => {
    const statusClass = reserva.status.toLowerCase();
    const horaFormatada = reserva.hora
        ? reserva.hora.substring(0, 5)
        : '--:--';
      const status = reserva.status?.toLowerCase() || '';

    html += `
          <tr>
              <td>${formatarData(reserva.data)}</td>
              <td>${horaFormatada}</td>
              <td>${reserva.numero_mesa}</td>
              <td>${reserva.qtd_pessoas}</td>
              <td>${reserva.nome_responsavel}</td>
              <td><span class="status-badge ${statusClass}">${reserva.status.toUpperCase()}</span></td>
              <td>${reserva.garcom_responsavel || '-'}</td>
          </tr>
      `;
  });

  html += `</tbody></table></div>`;
  resultadoDiv.innerHTML = html;
}

// Evento de envio do formulário por mesa
formMesa.addEventListener('submit', async (e) => {
  e.preventDefault();
  const numero = document.querySelector('#numero-mesa').value;

  try {
    const response = await fetch(`${urlDaAPI}/relatorio/mesa/${numero}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Erro ao carregar dados da mesa');
    }

    displayMesaReport(data);
    alert('Relatório gerado com sucesso!');
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

// Função para exibir relatório por mesa
function displayMesaReport(data) {
  const resultadoDiv = document.querySelector('#resultado');
  resultadoDiv.innerHTML = '';

  // Verifica se há dados e se a estrutura está correta
  if (!data || !data.success || !data.data) {
    resultadoDiv.innerHTML = '<p class="no-results">Nenhuma reserva encontrada para esta mesa.</p>';
    return;
  }

  // Cria o cabeçalho do relatório
  let html = `
      <div class="report-container">
        <div class="report-header">
            <h3>Relatório da Mesa ${data.data[0]?.numero_mesa || 'N/A'}</h3>
            <div class="report-summary">
                    <div class="report-summary-item report-summary-total">
                      Total: ${data.resumo?.total || 0}
                    </div>
                    <div class="report-summary-item report-summary-confirmed">
                      Confirmadas: ${data.resumo?.confirmadas || 0}
                    </div>
                    <div class="report-summary-item report-summary-cancelled">
                      Canceladas: ${data.resumo?.canceladas || 0}
                    </div>
              </div>
        </div>
  `;

  // Cria a tabela apenas se houver dados
  if (data.data.length > 0) {
    html += `
          <table class="report-table">
              <thead>
                  <tr>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Pessoas</th>
                      <th>Cliente</th>
                      <th>Status</th>
                      <th>Garçom</th>
                  </tr>
              </thead>
              <tbody>
      `;

    data.data.forEach(reserva => {
      const statusClass = reserva.status.toLowerCase();
      const horaFormatada = reserva.hora
        ? reserva.hora.substring(0, 5)
        : '--:--';
      const status = reserva.status?.toLowerCase() || '';

      html += `
              <tr class="${statusClass}">
                  <td>${formatarData(reserva.data)}</td>
                  <td>${horaFormatada}</td>
                  <td>${reserva.qtd_pessoas}</td>
                  <td>${reserva.nome_responsavel || 'Não informado'}</td>
                  <td><span class="status-badge ${statusClass}">${reserva.status.toUpperCase()}</span></td>
                  <td>${reserva.garcom_responsavel || '-'}</td>
              </tr>
          `;
    });

    html += `</tbody></table>`;
  } else {
    html += '<p class="no-results">Nenhuma reserva encontrada para esta mesa.</p>';
  }

  resultadoDiv.innerHTML = html;
}
// Evento de envio do formulário por garçom
formGarcom.addEventListener('submit', async (e) => {
  e.preventDefault();
  await carregarRelatorioGarcom();
  alert('Relatório gerado com sucesso!');
});

// Função para carregar relatório por garçom
async function carregarRelatorioGarcom() {
  try {
    const garcomSelecionado = document.getElementById('filtro-garcom').value;
    const url = `${urlDaAPI}/relatorio/garcom?garcom=${encodeURIComponent(garcomSelecionado)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Erro ao carregar relatório');
    }

    displayGarcomReport(data);

  } catch (error) {
    console.error("Erro:", error);
    document.getElementById('resultado').innerHTML = `
        <p class="error">${error.message}</p>
    `;
  }
}

// Função para exibir relatório por garçom
function displayGarcomReport(reportData) {
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  // Verificação segura dos dados
  const reservas = reportData?.data?.reservas || [];
  const totais = reportData?.data?.totalPorGarcom || [];

  if (reservas.length === 0) {
    resultadoDiv.innerHTML = '<p class="no-results">Nenhuma reserva confirmada encontrada.</p>';
    return;
  }

  // Agrupa reservas por garçom de forma segura
  const reservasPorGarcom = reservas.reduce((acc, reserva) => {
    const garcom = reserva.garcom_responsavel || 'Sem garçom';
    if (!acc[garcom]) {
      acc[garcom] = {
        reservas: [],
        total: totais.find(t => t.nome === garcom)?.total || 0
      };
    }
    acc[garcom].reservas.push(reserva);
    return acc;
  }, {});

  let html = '<div class="report-container">';

  for (const [garcom, { reservas, total }] of Object.entries(reservasPorGarcom)) {
    html += `
          <div class="garcom-section">
              <h4>${garcom} - Total: ${total}</h4>
              <table class="report-table">
                  <thead>
                      <tr>
                          <th>Data</th>
                          <th>Hora</th>
                          <th>Mesa</th>
                          <th>Pessoas</th>
                          <th>Cliente</th>
                          <th>Status</th>
                      </tr>
                  </thead>
                  <tbody>
      `;

    reservas.forEach(reserva => {
      const horaFormatada = reserva.hora
        ? reserva.hora.substring(0, 5)
        : '--:--';
      const status = reserva.status?.toLowerCase() || '';

      html += `
              <tr>
                  <td>${formatarData(reserva.data)}</td>
                  <td>${horaFormatada}</td>
                  <td>${reserva.numero_mesa}</td>
                  <td>${reserva.qtd_pessoas}</td>
                  <td>${reserva.nome_responsavel || 'Não informado'}</td>
                  <td class="status-${status}">${status.toUpperCase()}</td>
              </tr>
          `;
    });

    html += `
                  </tbody>
              </table>
          </div>
      `;
  }

  html += '</div>';
  resultadoDiv.innerHTML = html;
}

// Função para carregar garçons
async function carregarGarcons() {
  try {
    const response = await fetch(`${urlDaAPI}/relatorio/garcom`);
    const data = await response.json();

    if (data.success && data.data.garcons) {
      const select = document.getElementById('filtro-garcom');
      select.innerHTML = `
            <option value="todos">Todos os garçons</option>
            ${data.data.garcons.map(garcom => `
                <option value="${garcom.nome}">${garcom.nome}</option>
            `).join('')}
        `;
    }
  } catch (error) {
    console.error('Erro ao carregar garçons:', error);
  }
}

// Função para exibir mensagens
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

function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}

// Carrega os garçons ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  carregarGarcons();
  carregarRelatorioGarcom();
});