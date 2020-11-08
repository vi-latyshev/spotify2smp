import { getSRPParams } from '@mtproto/core';

import { ModuleStatus } from 'module_entity';

import { TelegramApi } from './telegram_api';

export class TelegramClient extends ModuleStatus {
    readonly MAX_LENGTH = 70;

    private api: TelegramApi = new TelegramApi();

    constructor() {
        super('Telegram');
    }

    public authorization = async () => {
        let user = (await this.getSelf())?.user;

        if (user === undefined) {
            this.log('Authorization needed');

            const phone = await this.prompt('Please, enter your phone number', 'Required phone number');
            const sendCodeResult = await this.api.sendCode({ phone_number: phone });

            try {
                const code = await this.prompt('Please enter the secret code', 'Required secret code');
                const signInResult = await this.api.signIn({
                    phone_code: code,
                    phone_number: phone,
                    phone_code_hash: sendCodeResult.phone_code_hash,
                });
                user = signInResult.user;
            } catch (signInError) {
                if (signInError.error_message !== 'SESSION_PASSWORD_NEEDED') {
                    throw signInError;
                }
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const { srp_B, srp_id, current_algo } = await this.api.getPassword();
                const {
                    g, p, salt1, salt2,
                } = current_algo;

                const password = await this.prompt('Please enter user password', 'Required user password');

                const { A, M1 } = await getSRPParams({
                    g, p, salt1, salt2, gB: srp_B, password,
                });

                const authInfo = await this.api.checkPassword({ srp_id, A, M1 });
                user = authInfo.user;
            }
        }

        if (user._ === 'userEmpty') {
            this.log('User not registered. Skiped');
        } else {
            this.log(`Authorized on: ${user.username}`);
        }
    };

    public updateStatus = async (status: string = this.DEFAULT) => {
        await this.api.updateProfile({ about: status });
        this.log(`Status updated${status === this.DEFAULT ? ' to default' : ''}`);
    };

    public getSelf = async () => {
        try {
            return this.api.getFullUser({ _: 'inputUserSelf' });
        } catch (e) {
            return undefined;
        }
    };
}
