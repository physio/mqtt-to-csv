import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { OrderGenerator } from 'src/classes/order-generator.class';

@Injectable()
export class OrderNewListener {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @OnEvent('count-pieces.order')
    async handleNewOrderEvent(str: string) {
        const generator = new OrderGenerator();
        const words = generator.generate(str);

        const ItemNumber = words[0];
        const ProductionOrderNumber = words[1];
        const LotId = words[2];

        await this.cacheManager.set(`ItemNumber`, ItemNumber)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });

        await this.cacheManager.set(`ProductionOrderNumber`, ProductionOrderNumber)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });

        await this.cacheManager.set(`LotId`, LotId)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });
    }
}