import { Injectable, Logger } from "@nestjs/common";
import { Client, connect, IClientOptions, IConnackPacket } from 'mqtt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TelemetryInterface } from "src/interfaces/telemetry.interface";

@Injectable()
export class MqttSubscribeService {
    private _client: Client;


    constructor(
        private eventEmitter: EventEmitter2,
    ) {

        const clientID = 'client_' + Math.random().toString(16).slice(2, 8);
        const broker = process.env.MQTT_BROKER_HOST;

        const options: IClientOptions = {
            clientId: clientID,
            port: 1883,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            //  clean: true,
            rejectUnauthorized: false,
        };

        // connect to mqtt broker
        Logger.log(`Connecting to MQTT ${broker} broker with client ${clientID}...`, 'mqttClientService');
        this._client = connect(`mqtt://${broker}`, options);

        // handle connection event
        this._client.on('connect', (packet: IConnackPacket) => {
            Logger.log(`Connected to Broker ${broker}: ${JSON.stringify(packet)}. Ready to work`, 'mqttClientService');
            this.eventEmitter.emit('mqtt.connected', true);
            this.subscribe(`${process.env.DEVICE_ID}/data/out`)
        });

        // handle error
        this._client.on("error", (error: string) => {
            Logger.error(`Connection error. ${error}`, 'mqttClientService');
        });

        // handle subscribe event
        this._client.on("subscribe", (message: string) => {
            Logger.log(`Subscribed. ${message}`);
        });

        // handle message event
        this._client.on('offline', () => {
            Logger.log(`Disconnected from aws-connector`, 'mqttClientService');
        });

        this._client.on('message', async (topic: string, payload: Buffer) => {
            this.eventEmitter.emit('mqtt.telemetry', JSON.parse(payload.toString()) as TelemetryInterface)
        },
        );
    }

    public async subscribe(topic: string): Promise<void> {
        this._client.subscribe(topic, (err, granted) => {
            granted.forEach(({ topic, qos }) => {
                Logger.log(`subscribed to ${topic} with qos=${qos}`, 'mqttService');
            });
        });
    }
}
