import * as moment from "moment";

export class OrderClass {
    private _start = "";
    private _end = "";

    public setStart(): string {
        this._start = moment().format();
        return this._start;
    }

    public setEnd(): string {
        this._end = moment().format();
        return this._end;
    }

    public reset(): void {
        this._start = "";
        this._end = "";
    }

    public get start(): string {
        return this._start;
    }

    public get end(): string {
        return this._end;
    }


}