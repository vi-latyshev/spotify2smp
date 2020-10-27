// All variables with type 'boolean' checking as 'string' - "VAR === 'true'"

declare namespace NodeJS {
    export interface ProcessEnv {
        /**
         * @type {boolean}
         */
        IS_DEV: string;

        // Telegram

        /**
         * Update telegram bio
         *
         * @type {boolean}
         */
        TELEGRAM: string;

        TELEGRAM_API_ID: string;
        TELEGRAM_API_HASH: string;

        TELEGRAM_DEFAULT_BIO: string;
    }
}
