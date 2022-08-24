import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelemetryInterface } from '../interfaces/telemetry.interface';
import { HttpService } from 'nestjs-http-promise';
import { Cache } from 'cache-manager';

@Injectable()
export class SendCustomUrlListener {
    constructor(
        private httpService: HttpService,

        @Inject(CACHE_MANAGER) private cacheManager: Cache,


    ) {

    }

    @OnEvent('mqtt.telemetry')
    async sendTelemetry(event: TelemetryInterface): Promise<void> {
        let lastUpdate = await this.cacheManager.get(`${process.env.DEVICE_ID}:customUrl:lastUpdate`);
        if (lastUpdate == null) {
            let result = await this.cacheManager.set(`${process.env.DEVICE_ID}:customUrl:lastUpdate`, Date.now() / 1000 | 0, { ttl: 5 })
                .catch(err => {
                    Logger.error('E001: ' + err, 'SendCustomUrlListener');
                });
            let object = {
                "timestamp": Math.floor(Date.now() / 1000),
                "data": event
            }
            Logger.log(`Send data to Custom url: ${JSON.stringify(object)}`, 'SendCustomUrlListener');
            let call = await this.httpService.post(process.env.CUSTOM_URL_DESTINATION, object)
                .catch(err => {
                    Logger.error('E002: ' + err, 'SendCustomUrlListener');
                });
        }

    }




}