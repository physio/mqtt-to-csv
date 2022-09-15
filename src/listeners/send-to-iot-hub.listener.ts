import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelemetryInterface } from '../interfaces/telemetry.interface';
import { Cache } from 'cache-manager';
import { IotHubService } from 'src/services/iot-hub.service';

@Injectable()
export class SendToIotHublListener {
    private _enabled: boolean = false; // process.env.ENABLE_IOT_HUB as unknown as boolean;

    constructor(
        private iotHubService: IotHubService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @OnEvent('mqtt.telemetry')
    async sendTelemetry(event: TelemetryInterface): Promise<void> {
        if (this._enabled) {
            let lastUpdate = await this.cacheManager.get(`${process.env.DEVICE_ID}:iotHub:lastUpdate`);
            if (lastUpdate == null) {
                console.log('gestisco un invio a iot hub')
                let result = await this.cacheManager.set(`${process.env.DEVICE_ID}:iotHub:lastUpdate`, Date.now() / 1000 | 0, { ttl: 11 })
                    .catch(err => {
                        Logger.error('E001: ' + err, 'SendToIotHublListener');
                    });
                let object = this.iotHubService.generateMessage(event);
                console.log('object vale', object)

                let call = this.iotHubService.send(object)

            }
        }
    }




}