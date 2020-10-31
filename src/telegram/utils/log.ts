import debug from 'debug';

import { promtWithLog } from 'utils/prompt';

export const log = debug('module: Telegram');
log.enabled = true;

export const prompt = promtWithLog(log);
