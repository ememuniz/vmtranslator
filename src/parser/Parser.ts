import * as fs from 'fs';

export type CommandType = 'C_ARITHMETIC' | 'C_PUSH' | 'C_POP';

export class Parser {
  private commands: string[] = [];                           
            // Nesse array é onde armazenamos as linhas do arquivo, ou seja, os comandos VM que serão processados posteriormente.          
  private currentCommandIndex: number = -1;                  
            // Aqui é onde mantemos o índice do comando atual que está sendo processado. Inicialmente, ele é definido como -1, indicando que ainda não começamos a processar nenhum comando.
  private currentTokens: string[] = [];                      
            // Aqui é onde armazenamos os tokens do comando atual.

  constructor(filename: string) {
    const fileContent = fs.readFileSync(filename, 'utf-8');  
            // Para construir o parser, lemos o artigo passado como argumento e armazenamos seu conteúdo em uma string chamada fileContent.
    const lines = fileContent.split('\n');                   
            // Em seguida, dividimos essa string em linhas usando o método split('\n'), resultando em um array de strings chamado lines onde cada elemento é uma linha de código do arquivo VM.

    for (const line of lines) {
      const cleanLine = (line.split('//')[0] || '').trim();        
            // Em cada linha, o split separa o código e coloca como elemento 0 do array, e depois disso, tudo que for comentário, ou seja, o que vem depois do //, é adicionado como elemento 1 do array. 
            // como foi escolhido o elemento zero, então o que é armazenado na variável cleanLine é apenas o código, sem os comentários.
            // O papel do trim é remover quaisquer espaços em branco extras no início ou no final da linha;
      if (cleanLine.length > 0) {
        this.commands.push(cleanLine);
            // Se a linha limpa tiver um comprimento maior que 0, ou seja, se não for uma linha vazia, ela é adicionada ao array commands.
      }
    }
  }

  public hasMoreCommands(): boolean {
    return this.currentCommandIndex < this.commands.length - 1;
  }
            // Se o índice do comando atual for menor que o comprimento total dos comandos menos um (porque os indices começam em 0), então é true
            // true significa que ainda há mais comandos para processar
  
  public advance(): void {
    this.currentCommandIndex++;
            // Avança o index do comando atual para o próximo comando.
    const command = this.commands[this.currentCommandIndex]; 
            // Armazena o comando que possui o index atual em uma variável chamada command. 
    this.currentTokens = command?.split(' ') || [];
            // Divide o comando em tokens usando o espaço como delimitador e armazena os tokens no array currentTokens. 
            // O operador (?) é usado para garantir que, se command for undefined ou null, currentTokens seja definido como um array vazio.
  }

  public commandType(): CommandType {
    const firstToken = this.currentTokens[0];
    if (firstToken === 'push') return 'C_PUSH';
    if (firstToken === 'pop') return 'C_POP';
    return 'C_ARITHMETIC';
  }
            // Verifica o primeiro token do comando atual para determinar o tipo de comando.
  
  public arg1(): string | undefined {
    if (this.commandType() === "C_ARITHMETIC") {
      return this.currentTokens[0];
            // Se o comando for aritmético, significa que o primeiro token é o nome do comando, então ele é retornado diretamente.
            // Exemplo: "add"
    }
    return this.currentTokens[1];
            // Se o comando for push ou pop, significa que o segundo token é o argumento, então ele é retornado diretamente.
            // Exemplo: "push constant 7" , vai retornar o termo constant
  }

  public arg2(): number{
    return parseInt(this.currentTokens[2] ?? '', 10);
  }
            // Se o comando for push ou pop, significa que o terceiro token é o argumento, então ele é retornado diretamente.
            // Exemplo: "push constant 7" , vai retornar o termo 7
            // o ?? significa que se o currentTokens[2] for undefined, ele vai ser considerado como uma string vazia.
            // o 10 indica que o argumento deve ser interpretado como um inteiro base 10.
}
