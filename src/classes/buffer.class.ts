import { TelemetryInterface } from "src/interfaces/telemetry.interface";

export class BufferClass {
    private _data: TelemetryInterface[] = [];
    private _dim = 30;

    constructor() {
      //  for (let index = 0; index < 30; index++) {
      //      this._data.push(null);
     //   }
    }

    public getData(): string {
        let str = '';
        if (this._data.length > 0) {
            this._data.forEach((element, index) => {
                if (index ==  this._data.length -1 ) {
                    str = str + `${element.accelerometer.x}`;
                } else {
                    str = str + `${element.accelerometer.x},`;
                }
            });
        }

        return str;
    }

    public push(element: TelemetryInterface): string {
        if (this._data.length >= this._dim) {
        this._data.shift();
        }
        this._data.push(element);

        return this.getData();
    }


}