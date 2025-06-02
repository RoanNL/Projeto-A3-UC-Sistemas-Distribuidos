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

## 2.1. Preparação Inicial

### Linux/Mac:
`bash
# Clone o repositório
git clone https://github.com/RoanNL/Projeto-A3-UC-Sistemas-Distribuidos.git
cd Projeto-A3-UC-Sistemas-Distribuidos

# Configure as variáveis de ambiente
cp .env.example .env
nano .env  # Edite com suas configurações
Windows (PowerShell):
powershell

# Clone o repositório
git clone https://github.com/RoanNL/Projeto-A3-UC-Sistemas-Distribuidos.git
cd Projeto-A3-UC-Sistemas-Distribuidos

# Configure as variáveis
Copy-Item .env.example .env
notepad .env  # Edite com suas configurações


### 3. Execução do Sistema
### 3.1. Iniciando os Containers
Para Linux/Mac:
bash
# Construa e inicie os containers
docker-compose up --build -d

# Verifique os logs
docker-compose logs -f backend
Para Windows:
powershell
# Construa e inicie os containers
docker-compose up --build -d

# Verifique os logs
docker-compose logs -f backend

## 3.2. Acessando o Banco de Dados
Linux/Mac:

bash
`docker-compose exec db psql -U postgres -d restaurant_reservations`

Windows:

powershell
`docker-compose exec db psql -U postgres -d restaurant_reservations`

### 4. Acesso aos Serviços

|Interface	|URL	|Comando de Verificação|
|-----------|-----|--------------------------|
|Atendente	|http://localhost:8080/atendente	|curl http://localhost:3000/atendente/reservas|
|Garçom	|http://localhost:8080/garcom	|curl http://localhost:3000/garcom/mesas|
|Gerente	|http://localhost:8080/gerente	|curl http://localhost:3000/gerente/relatorios|


### 5. Comandos Úteis

Linux/Mac:

bash
# Reiniciar um serviço específico
docker-compose restart backend

# Limpar tudo
docker-compose down -v

Windows:
powershell
# Reiniciar um serviço específico
docker-compose restart backend

# Limpar tudo
docker-compose down -v

### 6. Solução de Problemas


### 7. Diagrama de Arquitetura
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

Repositório:
https://github.com/RoanNL/Projeto-A3-UC-Sistemas-Distribuidos

Este documento garante:
✔ Configuração simplificada via Docker
✔ Comandos específicos para cada SO
✔ Arquitetura containerizada
✔ Três interfaces de usuário distintas