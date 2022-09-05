import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelemetryInterface } from '../interfaces/telemetry.interface';
import { HttpService } from 'nestjs-http-promise';
import { Cache } from 'cache-manager';

@Injectable()
export class SendCustomUrlListener {
    private _enabled: boolean = true; // process.env.ENABLE_CUSTOM_URL as unknown as boolean;

    constructor(
        private httpService: HttpService,

        @Inject(CACHE_MANAGER) private cacheManager: Cache,


    ) {

    }

    @OnEvent('mqtt.telemetry')
    async sendTelemetry(event: TelemetryInterface): Promise<void> {

        let dataBI = {
            "time": Math.floor(Date.now() / 1000),
            "noiseSensor": event.noiseSensor,
            "lightSensor": event.lightSensor,
            "humidity": event.humidity,
            "temperature": event.temperature,
            "pressure": event.pressure,
            "acc_x": event.accelerometer.x,
            "acc_y": event.accelerometer.y,
            "acc_z": event.accelerometer.z,
            "gyro_x": event.gyro.x,
            "gyro_y": event.gyro.y,
            "gyro_z": event.gyro.z,
            "magn_x": event.magnetometer.x,
            "magn_y": event.magnetometer.y,
            "magn_z": event.magnetometer.z,
            "magn_r": event.magnetometer.r

        }
        if (this._enabled) {

            let lastUpdate = await this.cacheManager.get(`${process.env.DEVICE_ID}:customUrl:lastUpdate`);
            if (lastUpdate == null) {
                let result = await this.cacheManager.set(`${process.env.DEVICE_ID}:customUrl:lastUpdate`, Date.now() / 1000 | 0, { ttl: 12 })
                    .catch(err => {
                        Logger.error('E001: ' + err, 'SendCustomUrlListener');
                    });


                Logger.log(`Send data to ${process.env.CUSTOM_URL_DESTINATION}: ${JSON.stringify(dataBI)}`, 'SendCustomUrlListener');






                let call = await this.httpService.post(process.env.CUSTOM_URL_DESTINATION, [dataBI])
                    .catch(err => {
                        Logger.error('E002: ' + err + " " + process.env.CUSTOM_URL_DESTINATION, 'SendCustomUrlListener');
                    });
            }
        }
    }
}