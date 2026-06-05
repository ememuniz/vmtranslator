import * as fs from 'fs';
import * as path from 'path';

export class CodeWriter {
  private fileStream: number;    
    // Nessa variavel temos um ponteiro para o arquivo onde vamos escrever os comandos.
  private fileName: string;
    // Nessa variavel temos o nome do arquivo onde vamos escrever os comandos.
  private labelCounter: number = 0;
    // Nessa variavel temos o contador de labels.

  constructor(outputFile: string) {
    this.fileStream = fs.openSync(outputFile, 'w');
      // Abrimos o arquivo onde vamos escrever os comandos. 
      // O 'w' indica que vamos escrever no arquivo.
      // O que vai ser retornado pelo fs.openSync é um ponteiro para o arquivo.
    this.fileName = path.basename(outputFile, '.asm');
      // Nessa variavel temos o nome do arquivo onde vamos escrever os comandos.
      // O .asm indica que vamos pegar o nome do arquivo sem a extensão.
  }

  private write(line: string): void {
    fs.writeSync(this.fileStream, line + '\n');
      // Escrevemos a linha no arquivo que fileStream aponta. 
      // O writeSync retorna um booleano indicando se a escrita foi bem sucedida.
  }

  public writeArithmetic(command: string): void {
    this.write(`// ${command}`);
      // Escrevemos comentado no arquivo o comando que foi traduzido para o codigo assembly logo depois dele.
    if (command === 'add' || command === 'sub' || command === 'and' || command === 'or') {
      // Estado inicial RAM[0] = 258  |  RAM[257] = 5  |  RAM[256] = 10  |   A = ?  |   B = ?
      this.write('@SP');                 
      // A = 0                                |    M = RAM[A = 0] = 258                 |    D = ?
      this.write('AM=M-1');              
      // A = RAM[A = 0] - 1 = 258 - 1 = 257   |    M = RAM[A = 0] - 1 = 258 - 1 = 257   !    D = ?
      this.write('D=M');                 
      // A = 257                              |    M = RAM[A = 257] = 5                 |    D = RAM[A = 257] = 5
      this.write('A=A-1');               
      // A = 257 - 1 = 256                    |    M = RAM[A = 256] = 10                |    D = 5
      if (command === 'add') this.write('M=D+M'); 
      // A = 256                     |    M = 5 + RAM[A = 256] = 5 + 10 = 15   |    D = 5
      if (command === 'sub') this.write('M=M-D'); 
      // A = 256                     |    M = RAM[A = 256] - 5 = 10 - 5 = 5    |    D = 5
      if (command === 'and') this.write('M=D&M'); 
      // A = 256                     |    M = 5 & RAM[A = 256] = 5 & 10        |    D = 5
      if (command === 'or') this.write('M=D|M');  
      // A = 256                     |    M = 5 | RAM[A = 256] = 5 | 10        |    D = 5
    } else if (command === 'neg' || command === 'not') {
      this.write('@SP');                 
      // A = 0                       |    M = RAM[A = 0] = 258                 |    D = ?
      this.write('A=M-1');               
      // A = RAM[A = 0] - 1 = 258 - 1 = 257   |    M = RAM[A = 0] - 1 = 258 - 1 = 257   !    D = ?
      if (command === 'neg') this.write('M=-M'); 
      // A = 257                     |    M = -RAM[A = 257] = -5                |    D = ?
      if (command === 'not') this.write('M=!M'); 
      // A = 257                     |    M = !RAM[A = 257] = !5                |    D = ?
    } else if (command === 'eq' || command === 'gt' || command === 'lt') {
      const trueLabel = `TRUE_${this.labelCounter}`;
      const endLabel = `END_${this.labelCounter}`;
      this.labelCounter++;
      this.write('@SP');                 
      // A = 0                                |    M = RAM[A = 0] = 258                 |    D = ?
      this.write('AM=M-1');              
      // A = RAM[A = 0] - 1 = 258 - 1 = 257   |    M = RAM[A = 0] - 1 = 258 - 1 = 257   !    D = ?
      this.write('D=M');                 
      // A = 257                              |    M = RAM[A = 257] = 5                 |    D = RAM[A = 257] = 5
      this.write('A=A-1');               
      // A = 257 - 1 = 256                    |    M = RAM[A = 256] = 10                |    D = 5
      this.write('D=M-D');             
      // A = 256                              |    M = RAM[A = 256] = 10                |    D = RAM[A = 256] - 5 = 10 - 5 = 5
      this.write(`@${trueLabel}`); //@TRUE_0  
      // A = 256                              |    M = RAM[A = 256] = 10                |    D = RAM[A = 256] - 5 = 10 - 5 = 5
      if (command === 'eq') this.write('D;JEQ'); 
      // A = 256                              |    M = RAM[A = 256] = 10                |    D = RAM[A = 256] - 5 = 10 - 5 = 5
      if (command === 'gt') this.write('D;JGT'); 
      // A = 256                              |    M = RAM[A = 256] = 10                |    D = RAM[A = 256] - 5 = 10 - 5 = 5
      if (command === 'lt') this.write('D;JLT'); 
      // A = 256                              |    M = RAM[A = 256] = 10                |    D = RAM[A = 256] - 5 = 10 - 5 = 5

      this.write('D=0');  //FALSE(0)   
      // A = 256                              |    M = RAM[A = 256] = 10                |    D = 0
      this.write(`@${endLabel}`);  //@END_0
      this.write('0;JMP');         //jmp serve para pular se for verdadeiro
      this.write(`(${trueLabel})`);
      this.write('D=-1');          //TRUE_1
      // A = 256                              |    M = RAM[A = 256] = 10                |    D = -1
      this.write(`(${endLabel})`); //END_1
      this.write('@SP');           
      // A = 0                                |    M = RAM[A = 0] = 258                 |    D = -1
      this.write('A=M-1');
      // A = RAM[A = 0] - 1 = 258 - 1 = 257   |    M = RAM[A = 0] = 258                 !    D = -1
      this.write('M=D');
      // A = 257                              |    M = RAM[A = 257] = -1                |    D = -1
    }
  }

  public writePush(segment: string, index: number): void {
    this.write(`// push ${segment} ${index}`);    //push segment 7       RAM[A = 7] = 14.   RAM[0] = 258
    if (segment === 'constant') {
      this.write(`@${index}`);   // @7
      // A = 7   |    M = RAM[A = 7] = 14    |    D = ?
      this.write('D=A');         
      // A = 7   |    M = RAM[A = 7] = 14    |    D = 7
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 7
      this.write('A=M');
      // A = RAM[A = 0] = 258   |    M = RAM[A = 258] = ?    |    D = 7   
      this.write('M=D');
      // A = 258   |    M = RAM[A = 258] = 7    |    D = 7
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 7
      this.write('M=M+1');
      // A = 0   |    M = RAM[A = 0] + 1 = 258 + 1 = 259   |    D = 7
    } else if (['local', 'argument', 'this', 'that'].includes(segment)) {    //exemplo: push local 0 ou push this 0 ou push that 0 ou push argument 0
      const segmentMap: Record<string, string> = {
        'local':'LCL',
        'argument':'ARG',
        'this':'THIS',
        'that':'THAT'
      };                            
      //RAM[A = 7] = 14.   RAM[0] = 258     RAM[258] = 42
      this.write(`@${index}`)   // @0
      // A = 0   |    M = RAM[A = 0] = 258    |    D = ?
      this.write('D=A');
      // A = 0   |    M = RAM[A = 0] = 258    |    D = 0
      this.write(`@${segmentMap[segment]}`);   // @LCL
      this.write('A=D+M');
      // A = 0 + RAM[A = 0] = 0 + 258 = 258    |    M = RAM[A = 258] = 42   |    D = 0
      this.write('D=M');
      // A = 258   |    M = RAM[A = 258] = 42    |    D = 42
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 42
      this.write('A=M');
      // A = RAM[A = 0] = 258   |    M = RAM[A = 258] = ?    |    D = 42
      this.write('M=D');
      // A = 258   |    M = RAM[A = 258] = 42    |    D = 42
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 42
      this.write('M=M+1');
      // A = 0   |    RAM[A = 0] = RAM[A = 0] + 1 = 258 + 1 = 259   |    D = 42
    } else if (segment === 'temp') {
      // push temp 2 - "Vá à gaveta 7, pegue no valor que está lá e coloque-o no topo da pilha".   //RAM[A = 7] = 14.   RAM[0] = 258     RAM[258] = ?
      this.write(`@${5 + index}`)  //@7
      // A = 7   |    M = RAM[A = 7] = 14    |    D = ?
      this.write('D=M');
      // A = 7   |    M = RAM[A = 7] = 14    |    D = 14
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 14
      this.write('A=M');
      // A = RAM[A = 0] = 258   |    M = RAM[A = 258] = ?    |    D = 14
      this.write('M=D');
      // A = 258   |    RAM[A = 258] = 14    |    D = 14
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 14
      this.write('M=M+1');
      // A = 0   |    RAM[A = 0] = RAM[A = 0] + 1 = 258 + 1 = 259   |    D = 14
    } else if (segment === 'pointer') {
      // THIS - "Vai buscar o endereço que está guardado no THIS (RAM[3]) e coloca-o no topo da pilha". - pointer 0
      // THAT - "Tira o valor que está no topo da pilha e guarda-o dentro do THAT (RAM[4])". - pointer 1
      // pointer 0      RAM[3] = 2   RAM[0] = 258     RAM[258] = ?
      this.write(index === 0 ? '@THIS' : '@THAT');  //@3
      // A = 3   |    M = RAM[A = 3] = 2    |    D = ?
      this.write('D=M');
      // A = 3   |    M = RAM[A = 3] = 2    |    D = 2
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 2
      this.write('A=M');
      // A = RAM[A = 0] = 258   |    M = RAM[A = 258] = ?    |    D = 2
      this.write('M=D');
      // A = 258   |    RAM[A = 258] = 2    |    D = 2
      this.write('@SP');
      // A = 0   |    M = RAM[A = 0] = 258   |    D = 2
      this.write('M=M+1');
      // A = 0   |    RAM[A = 0] = RAM[A = 0] + 1 = 258 + 1 = 259   |    D = 2
    } else if (segment === 'static') {         //push static 2        ficheiro: BasicTest.vm    RAM[18] = 42   RAM[0] = 258     RAM[258] = ?
      this.write(`@${this.fileName}.${index}`);       //@BasicTest.vm.2.   -> isso representa uma local da memoria, vamos supor que seja o 18
      // A = 18   |    M = RAM[A = 18] = 42    |    D = ?
      this.write('D=M');
      // A = 18   |    M = RAM[A = 18] = 42    |    D = 42
      this.write('@SP');
      // A = 0    |.    M = RAM[A = 0] = 258   |    D = 42
      this.write('A=M');
      // A = RAM[A = 0] = 258   |    M = RAM[A = 258] = ?    |    D = 42
      this.write('M=D');
      // A = 258   |    RAM[A = 258] = 42    |    D = 42
      this.write('@SP');
      // A = 0    |    M = RAM[A = 0] = 258   |    D = 42
      this.write('M=M+1');
      // A = 0    |    RAM[A = 0] = RAM[A = 0] + 1 = 258 + 1 = 259   |    D = 42
    }
  }

  public writePop(segment: string, index: number): void {
    this.write(`// pop ${segment} ${index}`);  
    if (['local', 'argument', 'this', 'that'].includes(segment)) {
      // pop local 5      RAM[0] = 258     RAM[258] = ?   RAM[3] = 10
      // "Tire o valor que está no topo da pilha, descubra onde fica o local 5 (Base do LCL + 5) e guarde esse valor lá".
      const segmentMap: Record<string, string> = {
        'local': 'LCL',
        'argument': 'ARG',
        'this': 'THIS',
        'that': 'THAT'
      };
      this.write(`@${index}`); //@3
      // A = 5   |    M = RAM[A = 5] = ?    |    D = ?
      this.write('D=A');
      // A = 5   |    M = RAM[A = 5] = ?    |    D = 5
      this.write(`@${segmentMap[segment]}`);        //@LCL
      // A = 5   |    M = RAM[A = 5] = 258   |    D = 3
      this.write('D=D+M');
      // A = 5   |    M = RAM[A = 5] = 258   |    D = 258 + 3 = 261
      this.write('@R13');
      // A = 13   |    M = RAM[A = 13] = ?    |    D = 261
      this.write('M=D');
      // A = 13   |    RAM[A = 13] = 261   |    D = 261
      this.write('@SP');
      // A = 0    |    M = RAM[A = 0] = 258   |    D = 261
      this.write('AM=M-1');
      // A = RAM[A = 0] - 1 = 258 - 1 = 257    |    RAM[A = 0] = RAM[A = 0] - 1 = 258 - 1 = 257   |    D = 261
      this.write('D=M');
      // A = 257   |    M = RAM[A = 257] = ?    |    D = 257
      this.write('@R13');
      // A = 13   |    M = RAM[A = 13] = 261   |    D = 257
      this.write('A=M');
      // A = 261   |    M = RAM[A = 261] = ?    |    D = 257
      this.write('M=D');
      // A = 261   |    RAM[A = 261] = 257   |    D = 257
    }
  }
}
