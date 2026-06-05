import * as fs from 'fs';
import { Parser } from '../src/parser/Parser';

// Simulamos um arquivo criando um temporário no disco
const TEST_FILE = './test_temp.vm';

describe('Parser', () => {
    beforeAll(() => {
        fs.writeFileSync(TEST_FILE, `
            // Comentário de teste
            push constant 10 // outro comentário
            
            add
        `);
    });

    afterAll(() => {
        fs.unlinkSync(TEST_FILE); // Limpa o arquivo após o teste
    });

    it('deve processar os comandos ignorando comentários e linhas em branco', () => {
    const parser = new Parser(TEST_FILE);
    
    expect(parser.hasMoreCommands()).toBe(true);
    parser.advance();
    // Ajustado aqui: usando a string literal direta
    expect(parser.commandType()).toBe('C_PUSH'); 
    expect(parser.arg1()).toBe('constant');
    expect(parser.arg2()).toBe(10);

    expect(parser.hasMoreCommands()).toBe(true);
    parser.advance();
    // Ajustado aqui: usando a string literal direta
    expect(parser.commandType()).toBe('C_ARITHMETIC'); 
    expect(parser.arg1()).toBe('add');
    
    expect(parser.hasMoreCommands()).toBe(false);
  });
});
