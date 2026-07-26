export class ProgressEvent extends Event {
    lengthComputable: boolean;
    loaded: number;
    total: number;

    constructor(type: string, initDict: any) {
        super(type, initDict);

        this.lengthComputable = initDict.lengthComputable ?? false;
        this.loaded = initDict.loaded ?? 0;
        this.total = initDict.total ?? 0;
    }
}