import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FileClass } from 'src/classes/file.class';
import { machine } from 'src/consts/machine.const';
import { TelemetryInterface } from '../interfaces/telemetry.interface';

@Injectable()
export class AppendTelemetryListener {
    private fileState = Object.create(machine);
    private _fileClass: FileClass; // = new FileClass();
    private _enabled: boolean = true //process.env.ENABLE_CSV as unknown as boolean;


    constructor(
        private eventEmitter: EventEmitter2,

    ) {
        if (this._enabled) {
            this.createFile();
        }
        Logger.warn(`append telemetry to file status: ${this._enabled}`);
    }

    protected createFile() {
        this._fileClass = new FileClass();
        this._fileClass.create();
    }

    protected closeFile() {
        this.fileState = null;
    }


    @OnEvent('mqtt.telemetry')
    async handleMqttTelemetrydEvent(event: TelemetryInterface) {
        if (this._enabled == true) {

            this.fileState.dispatch('next');
            if (this.fileState.state === 'CLOSED') {
                Logger.log('File closed.')
                this.eventEmitter.emit('csv.closed', this._fileClass.fileName)

                this.createFile();
                this.fileState = Object.create(machine)
            } else {
                this._fileClass.append(event)
            }
        }
    }
}