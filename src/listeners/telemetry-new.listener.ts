import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FileClass } from 'src/classes/file.class';
import { machine } from 'src/consts/machine.const';
import { TelemetryInterface } from '../interfaces/telemetry.interface';

@Injectable()
export class TelemetryNewListener {
    private fileState = Object.create(machine);
    private _fileClass: FileClass; // = new FileClass();


    constructor() {
        this.createFile();
    }

    protected createFile() {
        this._fileClass = new FileClass();
        this._fileClass.create();
    }

    protected closeFile() {
        this.fileState = null;
    }


    @OnEvent('mqtt.telemetry')
    async handleAlarmConvertedEvent(event: TelemetryInterface) {
        this.fileState.dispatch('next');
        if (this.fileState.state === 'CLOSED') {
            Logger.log('File closed.')
            this.createFile();
            this.fileState = Object.create(machine)
        } else {
            this._fileClass.append(event)
            Logger.log(event)
        }
    }
}