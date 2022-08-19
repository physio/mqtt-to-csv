import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FileClass } from 'src/classes/file.class';
import { TelemetryInterface } from '../interfaces/telemetry.interface';
import { Cache } from 'cache-manager';

@Injectable()
export class UpdateRedisListener {
    private _fileClass: FileClass; // = new FileClass();


    constructor(
        private eventEmitter: EventEmitter2,

        @Inject(CACHE_MANAGER) private cacheManager: Cache,

    ) {
        this.createFile();
    }

    protected createFile() {
        this._fileClass = new FileClass();
        this._fileClass.create();
    }

    protected closeFile() {

    }


    @OnEvent('mqtt.telemetry')
    async handleMqttTelemetrydEvent(event: TelemetryInterface) {
        for (const [key, value] of Object.entries(event)) {
            if (typeof value == 'object') {
                for (const [subkey, subvalue] of Object.entries(value)) {
                    await this.cacheManager.set(`${process.env.DEVICE_ID}:telemetry:${key}:${subkey}`, subvalue)
                        .catch(err => {
                            Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                        });
                }
            } else {
                await this.cacheManager.set(`${process.env.DEVICE_ID}:telemetry:${key}`, value)
                    .catch(err => {
                        Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                    });
            }
        }
    }
}