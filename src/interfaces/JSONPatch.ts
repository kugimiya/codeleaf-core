export type JSONPatchAction = 'add' | 'remove' | 'replace';

export interface JSONPatch {
    path: string;
    op: JSONPatchAction;
    value?: any;
}
