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
  * * Identifica os comandos da **Parte 1** (Aritméticos, Push, Pop) e da **Parte 2** (Controle de Fluxo: `label`, `goto`, `if-goto` e Sub-rotinas: `function`, `call`, `return`).

* **CodeWriter (`CodeWriter.ts`):** * Recebe os comandos interpretados pelo Parser e gera o Assembly (`.asm`).
  * **(Parte 1)** Traduz comandos de pilha (`push`, `pop`) mapeando-os para os segmentos de memória (`local`, `argument`, `this`, `that`, `constant`, `static`, `temp`, `pointer`).
  * **(Parte 1)** Traduz comandos aritméticos e lógicos (`add`, `sub`, `neg`, `eq`, `gt`, `lt`, `and`, `or`, `not`).
  * **(Parte 2)** Traduz comandos de fluxo, criando rótulos únicos por função (`NomeDaFuncao$NomeDoLabel`).
  * **(Parte 2)** Traduz `function` e `return`, restaurando o frame (LCL, ARG, THIS, THAT) e lidando com recursão.
  * **(Parte 2)** Traduz `call`, salvando o estado do programa atual na pilha.
  * **(Parte 2)** Injeta o **Bootstrap Code** (`SP=256` seguido de `call Sys.init 0`) automaticamente quando o programa lê um diretório.

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
npx ts-node src/main.ts caminho/para/a/pasta
```
Exemplo de uso:

```Bash
npx ts-node src/main.ts 07/MemoryAccess/BasicTest/BasicTest.vm
npx ts-node src/main.ts 08/FunctionCalls/NestedCall
```
Isso gerará um arquivo chamado BasicTest.asm contendo o código Assembly traduzido.

🧪 Como Rodar os Testes
O projeto utiliza o Jest para garantir que o Parser e o CodeWriter estejam funcionando corretamente (ignorando comentários, identificando comandos adequados, etc).

Para rodar a suíte de testes, execute:

```Bash
npx jest
```

📄 Exemplo de Saída
Para ilustrar o funcionamento, veja um teste simples de adição:

Entrada (SimpleMath.vm):

```Snippet de código
// Empilha 7 e 8, e realiza a soma
push constant 7
push constant 8
add
```
Saída Gerada (SimpleMath.asm):

```Snippet de código
// push constant 7
@7
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 8
@8
D=A
@SP
A=M
M=D
@SP
M=M+1

// add
@SP
AM=M-1
D=M
A=A-1
M=D+M
```
# 📂 Estrutura do Projeto
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