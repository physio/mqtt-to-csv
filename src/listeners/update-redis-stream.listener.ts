import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FileClass } from 'src/classes/file.class';
import { TelemetryInterface } from '../interfaces/telemetry.interface';
import { Cache } from 'cache-manager';
import { BufferClass } from 'src/classes/buffer.class';

@Injectable()
export class UpdateRedisStreamListener {

    private _buffer = new BufferClass();

    constructor(
        private eventEmitter: EventEmitter2,

        @Inject(CACHE_MANAGER) private cacheManager: Cache,

    ) { 

       }





    @OnEvent('mqtt.telemetry')
    async handleMqttTelemetrydEvent(event: TelemetryInterface) {
        this._buffer.push(event);
        await this.cacheManager.set(`${process.env.DEVICE_ID}:data:acc_x`, this._buffer.getData())
                        .catch(err => {
                            Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                        });
    }
}