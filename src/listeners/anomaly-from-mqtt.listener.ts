import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpService } from 'nestjs-http-promise';
import { Cache } from 'cache-manager';

@Injectable()
export class AnomalyFromMqttListener {

    constructor(
        private httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @OnEvent('mqtt.anomaly')
    async pieceFromMqtt(event: string): Promise<void> {

        const ItemNumber = await this.cacheManager.get(`ItemNumber`)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });

        const ProductionOrderNumber = await this.cacheManager.get(`ProductionOrderNumber`)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });

        const LotId = await this.cacheManager.get(`LotId`)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });



        if (event.toString() as unknown as number == 0) {
            const piece = {
                "EventType": "Quality",
                "Asset": "None",
                "ItemNumber": ItemNumber,
                "ProductionOrderNumber": ProductionOrderNumber,
                "LotId": LotId,
                "LineNumber": 1
            }

            await this.httpService.post(process.env.ADD_PIECE_URL, piece)
                .catch(err => {
                    Logger.error('E002: ' + err + " " + process.env.ADD_PIECE_URL, 'SendCustomUrlListener');
                });
            Logger.log(`Anomaly sended to LogicApp: ${JSON.stringify(piece)}`)
        }




    }
}