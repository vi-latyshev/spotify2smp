import { createInterface } from 'readline';

export const prompt = (question: string): Promise<string> => new Promise((resolve) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question(`${question}:\n`, (value) => {
        rl.close();
        resolve(value);
    });
});
