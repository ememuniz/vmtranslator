import { Parser, CommandType } from './parser/Parser';
import { CodeWriter } from './codewriter/CodeWriter';

function main() {
    const inputArg = process.argv[2]; // Recebe o arquivo.vm[cite: 527].
    
    if (!inputArg || !inputArg.endsWith('.vm')) {
        console.error("Por favor, forneça um arquivo .vm válido.");
        process.exit(1);
    }

    const outputFile = inputArg.replace('.vm', '.asm'); // Prepara arquivo de saída[cite: 528].

    const parser = new Parser(inputArg);
    const codeWriter = new CodeWriter(outputFile);

    while (parser.hasMoreCommands()) {
        parser.advance();
        const type = parser.commandType();

        if (type === "C_ARITHMETIC") {
            codeWriter.writeArithmetic(parser.arg1()?.trim() ?? '');
        } else if (type === "C_PUSH") {
            codeWriter.writePush(parser.arg1()?.trim() ?? '', parser.arg2());
        } else if (type === "C_POP") {
            codeWriter.writePop(parser.arg1()?.trim() ?? '', parser.arg2());
        }
    }

    codeWriter.close(); // Finaliza e fecha o arquivo[cite: 542].
    console.log(`Tradução concluída: ${outputFile}`);
}

main();