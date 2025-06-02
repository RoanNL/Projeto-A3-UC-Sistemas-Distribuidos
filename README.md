# Projeto-A3-UC-Sistemas-Distribuidos  
**Documentação de Instalação via Docker**  
**Disciplina:** Sistemas Distribuídos e Mobile  
**Turma:** Quarta/Matutino  
**Data de Entrega:** 11/06/2025  

---

# 1. Requisitos do Sistema

## 1.1. Pré-requisitos
| **Componente**       | **Linux/Mac** | **Windows** | **Link** |
|----------------------|--------------|------------|----------|
| Docker              | `sudo apt install docker.io` | Docker Desktop | [docker.com](https://docker.com) |
| Docker Compose      | `sudo apt install docker-compose` | Incluído no Docker Desktop | - |
| Git                 | `sudo apt install git` | Git for Windows | [git-scm.com](https://git-scm.com) |

---

# 2. Configuração do Ambiente Docker
## 2.1. Confiração inicial

### Linux/Mac:

**passo 1: Baixe a pasta raiz do projeto pelo github**

**passo 2: Acesse a pasta raiz (Projeto-A3-UC-Sistemas-Distribuido)**

**passo 3: Crie um arquivo para as variáveis ambiente (.env)**

**passo 4: abra o .env como bloco de notas e coloque esses comandos:**

DB_USER=postgres
DB_PASSWORD=123321
DB_NAME=restaurant_reservations
PORT=3000

**passo 5: Salve o bloco de notas e saia**


# Windows (PowerShell):

**passo 1: Baixe a pasta raiz do projeto pelo github**

**passo 2: Acesse a pasta raiz (Projeto-A3-UC-Sistemas-Distribuido)**

**passo 3: Crie um arquivo para as variáveis ambiente (.env)**

**passo 4: abra o .env como bloco de notas e coloque esses comandos:**

DB_USER=postgres
DB_PASSWORD=123321
DB_NAME=restaurant_reservations
PORT=3000

**passo 5: Salve o bloco de notas e saia**

### 3. Execução do Sistema
### 3.1. Iniciando os Containers

# Para Linux/Mac:

**bash**
Construa e inicie os containers
`docker-compose up --build -d`

Verifique os logs:
`docker-compose logs -f backend`

saida esperada:

```
 🚀 Servidor rodando na porta 3000
 ✔ Conectado ao PostgreSQL com sucesso!
```

## Para Windows:

**powershell**
Construa e inicie os containers: 
`docker-compose up --build -d`

Verifique os logs:
`docker-compose logs -f backend`


saida esperada:

```
 🚀 Servidor rodando na porta 3000
 ✔ Conectado ao PostgreSQL com sucesso!
```

## 3.2. Acessando o Banco de Dados no terminal

# Linux/Mac:
**bash**
`docker-compose exec db psql -U postgres -d restaurant_reservations`

digite para ver as tabelas:
`\dt`

saida esperada:

|Schema|Name|Type|Owner|
|------|----|----|-----|
|public|garcons|table|postgres|
|public|mesas|table|postgres|
|public|reservas|table|postgres|

# Windows:
**powershell**
`docker-compose exec db psql -U postgres -d restaurant_reservations`

digite para ver as tabelas:
`\dt`

saida esperada:

|Schema|Name|Type|Owner|
|------|----|----|-----|
|public|garcons|table|postgres|
|public|mesas|table|postgres|
|public|reservas|table|postgres|

### 4. Acesso aos Serviços

|**Interface**	|**URL**	|
|-----------|-----|
|Front-end	|http://localhost	|
|Back-end	|http://localhost:3000	|

### 5. Comandos Úteis

# Linux/Mac:

**bash**
Reiniciar um serviço específico:
`docker-compose restart backend`
`docker-compose restart frontend`

Limpar tudo:
`docker-compose down -v`

# Windows:

**powershell**
Reiniciar um serviço específico:
`docker-compose restart backend`
`docker-compose restart frontend`

Limpar tudo::
`docker-compose down -v`


### 6. Diagrama de Arquitetura
Clientes (Browser)

       ↓

Nginx (Frontend:8080)

       ↓

Node.js (Backend:3000)

       ↓

PostgreSQL (db:5432)


### Equipe:
**Roan Nascimento Lisboa (Backend)**

**Alice Martins Bahiense Bezerra Bauler (Frontend)**

**Catarina dos Santos Romeiro (Frontend)**

**Eduardo Copque da Silva (Documentação/Backend)**

Repositório: https://github.com/RoanNL/Projeto-A3-UC-Sistemas-Distribuidos

Este documento garante:
✔ Configuração simplificada via Docker

✔ Comandos específicos para cada SO

✔ Arquitetura containerizada

✔ Três interfaces de usuário distintas