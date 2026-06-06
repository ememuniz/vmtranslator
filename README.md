# Programador
- Emerson Paulo Pinheiro Muniz
# 🚀 VM Translator

Este projeto é um **Tradutor de Máquina Virtual (VM Translator)** desenvolvido em **TypeScript**. Ele faz parte da disciplina de compiladores do curso de Engenharia da Computação da Universidade Federal do Maranhão. O projeto faz uso das ferramentas propostos pelo [Nand to Tetris](https://www.nand2tetris.org/) (Projetos 7 e 8).

O objetivo deste programa é ler arquivos contendo código de uma Máquina Virtual baseada em pilha (com a extensão `.vm`) e traduzi-los para a linguagem Assembly do computador Hack (arquivos com a extensão `.asm`).

## ✨ Funcionalidades

O tradutor possui duas partes principais que trabalham em conjunto:

* **Parser (`Parser.ts`):** * Abre e lê o arquivo `.vm`.
  * Ignora espaços em branco e comentários (`//`).
  * Quebra cada linha de comando em seus componentes léxicos (ex: `push`, `constant`, `10`).
  * Identifica o tipo do comando (Aritmético/Lógico, Push ou Pop).

* **CodeWriter (`CodeWriter.ts`):** * Recebe os comandos interpretados pelo Parser.
  * Traduz os comandos de controle de pilha (`push`, `pop`) mapeando-os para os segmentos de memória corretos (`local`, `argument`, `this`, `that`, `constant`, `static`, `temp`, `pointer`).
  * Traduz os comandos aritméticos e lógicos (`add`, `sub`, `neg`, `eq`, `gt`, `lt`, `and`, `or`, `not`).
  * Gera e escreve o código Assembly (`.asm`) correspondente no arquivo de saída.

## 🛠️ Tecnologias Utilizadas

* **[Node.js](https://nodejs.org/)** - Ambiente de execução.
* **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática e segurança no desenvolvimento.
* **[Jest](https://jestjs.io/)** - Framework para testes unitários.
* **ts-node** - Para rodar o código TypeScript diretamente no terminal.

## ⚙️ Pré-requisitos e Instalação

Certifique-se de ter o Node.js instalado na sua máquina. Em seguida, clone este projeto e instale as dependências:

```bash
# Instalar as dependências do projeto (TypeScript, Jest, etc)
npm install
```

🚀 Como Executar
Para rodar o tradutor, você deve passar o caminho do arquivo .vm que deseja traduzir como argumento no terminal.

Use o ts-node para executar o arquivo principal:

```Bash
npx ts-node src/main.ts caminho/para/o/arquivo.vm
```
Exemplo de uso:

```Bash
npx ts-node src/main.ts 07/MemoryAccess/BasicTest/BasicTest.vm
```
Isso gerará um arquivo chamado BasicTest.asm contendo o código Assembly traduzido.

🧪 Como Rodar os Testes
O projeto utiliza o Jest para garantir que o Parser e o CodeWriter estejam funcionando corretamente (ignorando comentários, identificando comandos adequados, etc).

Para rodar a suíte de testes, execute:

```Bash
npx jest
```
📂 Estrutura do Projeto
```Plaintext
📦 vmtranslator
 ┣ 📂 src
 ┃ ┣ 📂 parser
 ┃ ┃ ┗ 📜 Parser.ts       # Lida com a leitura e extração dos comandos VM
 ┃ ┣ 📂 writer
 ┃ ┃ ┗ 📜 CodeWriter.ts   # Lida com a tradução para Hack Assembly
 ┃ ┗ 📜 main.ts           # Ponto de entrada que orquestra o Parser e o CodeWriter
 ┣ 📂 tests
 ┃ ┗ 📜 Parser.test.ts    # Testes unitários do Parser
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┗ 📜 README.md
 ```