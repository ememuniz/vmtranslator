import * as fs from 'fs';
import * as path from 'path';
import { Parser, CommandType } from './parser/Parser';
import { CodeWriter } from './codewriter/CodeWriter';

function main() {
    const inputArg = process.argv[2]; 
    
    if (!inputArg) {
        console.error("Por favor, forneça um arquivo .vm ou um diretório.");
        process.exit(1);
    }

    let vmFiles: string[] = [];
    let outputFile: string;
    let isDirectory = false;

    const stat = fs.statSync(inputArg);

    // 1. Verifica se a entrada é um diretório ou um único ficheiro
    if (stat.isDirectory()) {
        isDirectory = true;
        
        // Pega todos os arquivos .vm dentro do diretório
        const files = fs.readdirSync(inputArg);
        vmFiles = files
            .filter(f => f.endsWith('.vm'))
            .map(f => path.join(inputArg, f));
        
        // O nome do arquivo de saída deve ser o nome do diretório (ex: pasta FibonacciElement vira FibonacciElement.asm)
        const dirName = path.basename(path.resolve(inputArg));
        outputFile = path.join(inputArg, `${dirName}.asm`);
        
    } else if (inputArg.endsWith('.vm')) {
        // Se for apenas um ficheiro
        vmFiles = [inputArg];
        outputFile = inputArg.replace('.vm', '.asm');
    } else {
        console.error("Entrada inválida. Forneça um arquivo .vm ou um diretório válido.");
        process.exit(1);
    }

    const codeWriter = new CodeWriter(outputFile);

    // 2. Se for um diretório (programa completo), escreve o Bootstrap!
    if (isDirectory) {
        codeWriter.writeInit();
    }

    // 3. Processa todos os ficheiros .vm encontrados
    for (const file of vmFiles) {
        const parser = new Parser(file);
        
        // ATENÇÃO: Atualiza o nome do ficheiro no CodeWriter para que as 
        // variáveis estáticas (static) recebam o nome correto de cada ficheiro!
        codeWriter.setFileName(path.basename(file, '.vm'));

        while (parser.hasMoreCommands()) {
            parser.advance();
            const type = parser.commandType();

            if (type === "C_ARITHMETIC") {
                codeWriter.writeArithmetic(parser.arg1()?.trim() ?? '');
            } else if (type === "C_PUSH") {
                codeWriter.writePush(parser.arg1()?.trim() ?? '', parser.arg2());
            } else if (type === "C_POP") {
                codeWriter.writePop(parser.arg1()?.trim() ?? '', parser.arg2());
            } else if (type === "C_LABEL") {
                codeWriter.writeLabel(parser.arg1()?.trim() ?? '');
            } else if (type === "C_GOTO") {
                codeWriter.writeGoto(parser.arg1()?.trim() ?? '');
            } else if (type === "C_IF") {
                codeWriter.writeIf(parser.arg1()?.trim() ?? '');
            } else if (type === "C_FUNCTION") {
                codeWriter.writeFunction(parser.arg1()?.trim() ?? '', parser.arg2());
            } else if (type === "C_RETURN") {
                codeWriter.writeReturn();
            } else if (type === "C_CALL") {
                codeWriter.writeCall(parser.arg1()?.trim() ?? '', parser.arg2());
            }
        }
    }

    codeWriter.close(); 
    console.log(`Tradução concluída: ${outputFile}`);
}

main();