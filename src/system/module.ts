import debug from 'debug';

import { promtWithLog } from 'utils/prompt';

export abstract class Module {
    protected readonly moduleName: string;

    protected readonly moduleNameLower: string;

    protected readonly moduleNameUpper: string;

    protected readonly log: debug.Debugger;

    protected readonly prompt: (question: string, logText: string) => Promise<string>;

    constructor(moduleName: string) {
        this.moduleName = moduleName;
        this.moduleNameLower = moduleName.toLowerCase();
        this.moduleNameUpper = moduleName.toLocaleUpperCase();

        this.log = debug(`module: ${this.moduleName}`);
        this.log.enabled = true;

        this.prompt = promtWithLog(this.log);
    }
}
