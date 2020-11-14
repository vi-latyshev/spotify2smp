import { Module } from './module';

export abstract class ModuleStatus extends Module {
    public readonly MAX_LENGTH?: number;

    public readonly IS_ON: boolean = false;

    public readonly DEFAULT: string = '';

    constructor(moduleName: string) {
        super(moduleName);

        this.IS_ON = process.env[this.moduleNameUpper] === 'true';
        this.DEFAULT = process.env[`${this.moduleNameUpper}_DEFAULT_STATUS`] ?? '';
    }
}
