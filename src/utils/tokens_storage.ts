import { readFile, writeFile } from 'fs/promises';

const TOKENS_FILE = 'tokens.json';

class TokenStorage {
    private tokens = new Map<string, string>();

    private isFileReaded: boolean = false;

    public hasToken = async (name: string) => {
        if (!this.isFileReaded) {
            await this.readTokensFile();
        }
        return this.tokens.has(name);
    };

    public getToken = async (name: string) => {
        if (!this.isFileReaded) {
            await this.readTokensFile();
        }
        return this.tokens.get(name);
    };

    public setToken = async (name: string, value: string) => {
        this.tokens = {
            ...this.tokens,
            [name]: value,
        };
        await this.writeToFile();
    };

    private readTokensFile = async () => {
        try {
            const file = await readFile(TOKENS_FILE);
            const objectOfTokens = JSON.parse(file.toString('utf8'));

            this.tokens = new Map(Object.entries(objectOfTokens));
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.writeToFile();
            }
            throw error;
        }

        this.isFileReaded = true;
    };

    /**
     * @todo try/catch errors
     */
    private writeToFile = async () => {
        const objectOfTokens = Object.fromEntries(this.tokens);
        await writeFile(TOKENS_FILE, JSON.stringify(objectOfTokens));
    };
}

export const tokenStorage = new TokenStorage();
