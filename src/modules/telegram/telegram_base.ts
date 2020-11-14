import { ModuleStatus } from 'system';

import { TelegramApi } from './telegram_api';

export class TelegramBase extends ModuleStatus {
    readonly MAX_LENGTH = 70;

    protected api: TelegramApi = new TelegramApi();

    constructor() {
        super('Telegram');
    }
}
