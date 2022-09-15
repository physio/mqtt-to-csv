import { Injectable, Logger } from "@nestjs/common";
import { Mqtt as Protocol } from 'azure-iot-device-mqtt';
import { Client, Message, Twin } from 'azure-iot-device';
import { TelemetryInterface } from "src/interfaces/telemetry.interface";


@Injectable()
export class IotHubService {
    private deviceConnectionString: string = process.env.IOTHUB_DEVICE_CONNECTION_STRING || '';
    private client: Client;
    private _twin: Twin;

    constructor() {
        if (this.deviceConnectionString === '') {
            console.log('device connection string not set');
            process.exit(-1);
        }

        this.client = Client.fromConnectionString(this.deviceConnectionString, Protocol);

        this.asyncMain().catch((err: any): void => {
            Logger.error('error code: ', err.code);
            Logger.error('error message: ', err.message);
            Logger.error('error stack: ', err.stack);
        });
    }

    public send(message: object): void {
        console.log('Sending message: ' + message);
        //this.client.sendEvent(message, this.printResultFor('send'));


        this._twin.properties.reported.update(message, function (err) {
            if (err) {
                console.error('could not update twin');
            } else {
                console.log('twin state reported');
                process.exit();
            }
        });
    }

    protected disconnectHandler(): void {
        clearInterval(30000);

        try {
            this.client.open().catch((err) => {
                Logger.error(err.message);
            });
        } catch {
            console.log('error')
        }

    }

    protected connectHandler(): void {
        Logger.log('Client IOT Hub connected');
    }

    private messageHandler(msg: any): void {
        Logger.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
        this.client.complete(msg, this.printResultFor('completed'));
    }

    protected errorHandler(err: any): void {
        Logger.error(err.message);
    }


    protected printResultFor(op: any): (err: any, res: any) => void {
        return function printResult(err: any, res: any): void {
            if (err) Logger.error(op + ' error: ' + err.toString());
            if (res) Logger.log(op + ' status: ' + res.constructor.name);
        };
    }


    // eslint-disable-next-line @typescript-eslint/ban-types
    public generateMessage(telemetry: TelemetryInterface): Object {
        const data = {
            // deviceId: process.env.DEVICE_ID,
            accelerometer: telemetry.accelerometer,
            humidity: telemetry.humidity,
            pressure: telemetry.pressure,
            temperature: telemetry.temperature,
            magnetometer: telemetry.magnetometer,
            gyro: telemetry.gyro,
            lightSensor: telemetry.lightSensor,
            noiseSensor: telemetry.lightSensor
        };
        /* const message: Message = new Message(data);
 
         message.properties.add(
             'temperatureAlert',
             telemetry.temperature > 38 ? 'true' : 'false'
         );*/

        return data;
    }

    protected async asyncMain(): Promise<void> {
        await this.client.open();

        this.client.on('connect', () => {
            this.connectHandler
            this.client.getTwin((err, twin) => {
                this._twin = twin;
                try {
                    console.log(this._twin.properties.reported)
                } catch {
                    Logger.error('No device connected.');
                }
            })
        });
        this.client.on('error', this.errorHandler);
        this.client.on('disconnect', this.disconnectHandler);
        this.client.on('message', this.messageHandler);

        this.client.open().catch((err) => {
            Logger.error('Could not connect: ' + err.message);
        });
    }
}