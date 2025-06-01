# Projeto-A3-UC-Sistemas-Distribuidos
**Documentação de Instalação - Sistema de Reservas de Restaurante**  
**Disciplina:** Sistemas Distribuídos e Mobile  
**Turma:** Quarta/Matutina  
**Data de Entrega:** 11/06/2025  

---

# 1. Requisitos do Sistema

# 1.1. Pré-requisitos
Antes de iniciar, verifique se os seguintes componentes estão instalados:  

| **Componente**       | **Versão Recomendada** | **Link de Download**                     |
|----------------------|------------------------|------------------------------------------|
| Node.js              | 18.x ou superior       | [https://nodejs.org/](https://nodejs.org/) |
| PostgreSQL           | 15.x ou superior       | [https://www.postgresql.org/download/](https://www.postgresql.org/download/) |

---

# 2. Instalação do Banco de Dados (PostgreSQL)

# 2.1. Configuração Inicial
# 1. Instale o PostgreSQL: seguindo o instalador do seu sistema operacional.  

   **Lembre de verificar se o path do postgresql está configurado** 

   **Passo a passo para verificar**
(

**Passo 1** -> Pressione Win + R, digite `sysdm.cpl` e clique em OK.

**Passo 2** -> Vá para a aba "Avançado" > "Variáveis de Ambiente".

**Passo 3** -> Em "Variáveis do sistema", selecione a variável Path e clique em "Editar".

**Passo 4** -> Clique em "Novo" e adicione o caminho completo da pasta bin:

`C:\Program Files\PostgreSQL\(Versão que instalou do postgreSQL)\bin)`

)

para verificar se está tudo certo digite no cmd ou powershell: `psql --version`, se aparecer algo que represente a versão do seu postgreSQL então está tudo certo!!

   **Lembre de utilizar a sua senha do usuário padrão (postgres) para acessar os proxímos passos, caso não lembre da senha, re-instale o postgreSQL e anote a senha que escolher no instalador, será extremamente necessário para a criação do banco de dados e conexão com a API**  

**Nota: deixarei em cima dos comando um (CMD/Bash ou algum outro), eles vão representar onde o senhor vai executa-los para dar seguimento e não ficar perdido**

   

# 2.2. Criação do Banco de Dados
# 2. Abra o terminal:  e execute o comando abaixo para acessar o PostgreSQL:
1. Acesse seu usuário do postgreSQL:

   CMD/Bash

   `psql -U postgres`

2. Crie o banco de dados:  

    sql

   `CREATE DATABASE restaurant_reservations;`
    
3. Conecte-se ao banco criado:

    sql

   `\c restaurant_reservations`
   
4. Execute o script `schema.sql` para criar as tabelas, abra o terminal na pasta do projeto:  

   CMD/Bash

   `psql -U postgres -d restaurant_reservations -a -f scripts/schema.sql`


# 2.3. Configuração de Acesso
Edite o arquivo `pg_hba.conf` ( no linux fica localizado em `/etc/postgresql/[versão]/main/` | no windows fica localizado em `C:\Program Files\PostgreSQL\[versão]\data`) para permitir conexões:  

# Adicione esta linha:
`host    all             all             127.0.0.1/32            md5`

---

# 3. Configuração do Backend (Node.js/Express)


## 3.1. Instalação das Dependências
1. Acesse a pasta raiz do projeto:  
   
   CMD/Bash
   
   `cd server`

2. Instale os pacotes necessários:  
   
   CMD/Bash
   
   `npm install`
 
 
## 3.2. Configuração do Ambiente
1. Crie um arquivo `.env` na pasta raiz do projeto com:  
   
   ( DATABASE_URL=postgresql://postgres:senha@localhost:5432/restaurant_reservations
   PORT=3000 )
    
   > **Nota:** Substitua `senha` pela senha do seu PostgreSQL.

2. **Inicie o servidor:**  
   
   CMD/Bash

   `npm run dev` 
     
   Saída esperada:  
  
  ```
   🚀 Servidor rodando na porta 3000
   ✔ Conectado ao PostgreSQL com sucesso!
  ```

---

# 4. Configuração do Frontend

## 4.1. Execução
1. Abra os arquivos HTML diretamente no navegador:  
   - **Atendente:** `frontend/cliente-atendente/index.html`  
   - **Garçom:** `frontend/cliente-garcom/index.html`  
   - **Gerente:** `frontend/cliente-gerente/index.html`  

2. **Para desenvolvimento**, use a extensão **Live Server** do VSCode para evitar problemas com CORS.

---

# 5. Testes Iniciais

## 5.1. Banco de Dados
Verifique se as tabelas foram criadas:  

    sql

   ` \dt `

Saída esperada:  

          Lista de relações
| Esquema |   Nome    | Tipo   |  Dono|
|---------|-----------|--------|--------|
| public  | garcons   | tabela | postgres|
| public  | mesas     | tabela | postgres|
| public  | reservas  | tabela | postgres|


## 5.2. API
Teste os endpoints com **Postman** ou **curl**:  

CMD/Bash

`curl http://localhost:3000/gerente/garcons` 

Resposta esperada (JSON):  

[] 

---

# 6. Solução de Problemas Comuns

| **Problema**                          | **Solução**                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| Erro de conexão com PostgreSQL        | Verifique se o serviço está rodando (`service postgresql status`).     |
| Porta 3000 em uso                     | Altere a `PORT` no `.env` ou execute `kill -9 $(lsof -t -i:3000)`.          |
| Dados não persistem                   | Confira se o `schema.sql` foi executado sem erros.                          |

---

# 7. Diagrama de Arquitetura


Cliente (Frontend) → API REST (Node.js/Express) → PostgreSQL
       (HTML/JS/CSS)   ↑↓ JSON                   ↑↓ SQL



**Próximos Passos:**  
 1. vídeo de apresentação do trabalho: 

**Equipe:**  
Roan Nascimento Lisboa, Backend

Alice Martins Bahiense Bezerra Bauler, Frontend

Catarina dos Santos Romeiro, Frontend

Eduardo Copque da Silva, Documentação e Backend

**Repositório GitHub:** https://github.com/RoanNL/Projeto-A3-UC-Sistemas-Distribuidos

--- 

Este documento garante que todos os requisitos da UC sejam atendidos, incluindo:  
✔ Comunicação via API REST  
✔ Banco de dados relacional (PostgreSQL)  
✔ Três tipos de clientes com interfaces específicas  
✔ Instruções claras para replicação do ambiente.