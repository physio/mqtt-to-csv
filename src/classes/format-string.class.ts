import { Logger } from '@nestjs/common';
import { TelemetryInterface } from 'src/interfaces/telemetry.interface';
import { json } from 'stream/consumers';

export class FormatStringClass {

    /**
     * Get string by telemetry
     * 
     * @author Gallo Mauro <mauro.gallo@mentel.it>
     * @date 2022-08-13
     * @param {any} telemetry:TelemetryInterface
     * @returns {any}
     */
    public static getString(telemetry: TelemetryInterface): string {
        let moment = require('moment');
        let now = moment().valueOf();

        return `${now},${telemetry.accelerometer.x},${telemetry.accelerometer.y},${telemetry.accelerometer.z},${telemetry.gyro.x},${telemetry.gyro.y},${telemetry.gyro.z},${telemetry.humidity},${telemetry.lightSensor},${telemetry.magnetometer.r},${telemetry.magnetometer.x},${telemetry.magnetometer.y},${telemetry.magnetometer.z},${telemetry.noiseSensor},${telemetry.pressure},${telemetry.temperature}\n`
    }

    /**
     * Get header of csv data
     * 
     * @author Gallo Mauro <mauro.gallo@mentel.it>
     * @date 2022-08-13
     * @returns {any}
     */
    public static getHeader(): string {
        return 'timestamp,acc_x,acc_y,acc_z,gyro_x,gyro_y,gyro_z,humidity,light,magn_r,magn_x,magn_y,magn_z,noise,pressure,temperature\n';
    }

}