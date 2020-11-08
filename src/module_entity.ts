/* eslint-disable max-classes-per-file */
import debug from 'debug';

import { promtWithLog } from 'utils/prompt';

export abstract class Module {
    protected readonly moduleName: string;

    protected readonly log: debug.Debugger;

    protected readonly prompt: (question: string, logText: string) => Promise<string>;

    constructor(moduleName: string) {
        this.moduleName = moduleName;

        this.log = debug(`module: ${this.moduleName}`);
        this.log.enabled = true;

        this.prompt = promtWithLog(this.log);
    }

    public abstract authorization: () => Promise<void>;
}

export abstract class ModuleStatus extends Module {
    public readonly MAX_LENGTH?: number;

    public readonly IS_ON: boolean = false;

    public readonly DEFAULT: string = '';

    constructor(moduleName: string) {
        super(moduleName);

        const moduleNameUpper = this.moduleName.toUpperCase();

        this.IS_ON = process.env[moduleNameUpper] === 'true';
        this.DEFAULT = process.env[`${moduleNameUpper}_DEFAULT_STATUS`] ?? '';
    }

    public abstract updateStatus: (status: string) => Promise<void>;

    public abstract getSelf: () => Promise<any>;
}
