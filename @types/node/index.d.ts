declare namespace NodeJS {
    export interface ProcessEnv {
        IS_DEV: string;

        TELEGRAM_API_ID: string;
        TELEGRAM_API_HASH: string;

        TELEGRAM_DEFAULT_BIO: string;
    }
}
