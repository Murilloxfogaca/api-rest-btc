Instruções para Execução do Projeto eduzz_dev (Linux)

Este documento fornece instruções detalhadas para configurar e executar o projeto eduzz_dev em um ambiente Linux.
Requisitos

Certifique-se de ter o seguinte instalado em seu sistema:

    Node.js (versão recomendada: 16.x)
    npm (gerenciador de pacotes do Node.js)
    TypeScript (versão 4.5.2)
    Banco de dados PostgreSQL (opcional para o uso com TypeORM)

Instalação

    Clonando o Repositório

    Clone este repositório para o seu ambiente local:

    bash

git clone <url_do_seu_repositorio>
cd eduzz_dev

Instalando Dependências

Instale as dependências do projeto usando npm:

bash

    npm install

Configuração

    Variáveis de Ambiente

    Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente necessárias, como as conexões com o banco de dados, chaves JWT, etc. Um exemplo básico pode ser:

    makefile

PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=nome_do_banco_de_dados
JWT_SECRET=sua_chave_secreta_para_jwt

Configuração do TypeORM

Configure o TypeORM editando o arquivo ormconfig.json na raiz do projeto, se necessário, para corresponder às suas configurações de banco de dados.

Exemplo básico de ormconfig.json:

json

    {
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "seu_usuario",
      "password": "sua_senha",
      "database": "nome_do_banco_de_dados",
      "synchronize": true,
      "logging": false,
      "entities": ["src/config/domain/**/*{.js,.ts}"],
      "migrations": ["src/config/migration/**/*{.js,.ts}"],
      subscribers: ["src/config/subscriber/**/*{.js,.ts}"],,
    }

Execução

Compilar para Produção

Para compilar o projeto TypeScript para JavaScript, execute:

bash

npm run build

Isso cria uma pasta build com os arquivos compilados prontos para produção.

Executar em Modo de Produção

Para iniciar o projeto em modo de produção, após a compilação, execute:

bash

    npm start

Comandos Úteis

    npm run migration: Executa as migrações do TypeORM.
