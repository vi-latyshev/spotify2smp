import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const { NODE_PATH } = process.env;

const TOKENS_FILE = join(NODE_PATH as string, 'tokens.json');

class TokensStorage {
    private tokens = new Map<string, string | object>();

    private isFileReaded: boolean = false;

    public has = async (name: string) => {
        if (!this.isFileReaded) {
            await this.readFile();
        }
        return this.tokens.has(name);
    };

    public get = async (name: string) => {
        if (!this.isFileReaded) {
            await this.readFile();
        }
        return this.tokens.get(name);
    };

    public set = async (name: string, value: string | object) => {
        const stringifyValue = typeof value === 'object'
            ? JSON.stringify(value)
            : value;

        this.tokens.set(name, stringifyValue);
        await this.writeToFile();
    };

    private readFile = async () => {
        try {
            const file = await readFile(TOKENS_FILE);
            const objectOfTokens = JSON.parse(file.toString('utf8'));

            this.tokens = new Map(Object.entries(objectOfTokens));
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.writeToFile();
            } else {
                throw error;
            }
        }

        this.isFileReaded = true;
    };

    /**
     * @todo try/catch errors
     */
    private writeToFile = async () => {
        const objectOfTokens = Object.fromEntries(this.tokens);
        await writeFile(TOKENS_FILE, JSON.stringify(objectOfTokens, null, '\t'));
    };
}

export const tokensStorage = new TokensStorage();
