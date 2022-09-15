import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';

@Injectable()
export class ManageCountPiecesListener {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @OnEvent('count-pieces.order')
    async handleCountPiecesAddEvent(orderNumber: string) {

        const order = await this.cacheManager.get(`ProductionOrderNumber`)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });
        Logger.log(`create order work  ${order} for ${process.env.DEVICE_ID}`)


        const orderExist = await this.cacheManager.get(`${process.env.DEVICE_ID}:orders:${order}:start`)
            .catch(err => {
                Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
            });
        if (orderExist) {
            await this.cacheManager.set(`${process.env.DEVICE_ID}:orders:${order}:stop`, Date.now())
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });

            const start = await this.cacheManager.get(`${process.env.DEVICE_ID}:orders:${order}:start`)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });
            const stop = await this.cacheManager.get(`${process.env.DEVICE_ID}:orders:${order}:stop`)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });
            const pieces = await this.cacheManager.get(`${process.env.DEVICE_ID}:orders:${order}:pieces`)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });
            const history = await this.cacheManager.get(`${process.env.DEVICE_ID}:orders:${order}:history`)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });

            const newHistory = `${(history != null) ? history : ''}----> start: ${start}, pieces: ${pieces}, stop: ${stop}`
            await this.cacheManager.set(`${process.env.DEVICE_ID}:orders:${order}:history`, newHistory)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });

            await this.cacheManager.del(`${process.env.DEVICE_ID}:orders:${order}:start`)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });
            await this.cacheManager.del(`${process.env.DEVICE_ID}:orders:${order}:stop`)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });
            await this.cacheManager.del(`${process.env.DEVICE_ID}:orders:${order}:pieces`)
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });

            Logger.warn(`close order ${order} for ${process.env.DEVICE_ID}. Hisory updated.`)

        }
        else {
            await this.cacheManager.set(`${process.env.DEVICE_ID}:orders:${order}:start`, Date.now())
                .catch(err => {
                    Logger.error('E0021: ' + err, 'handleMqttTelemetrydEvent');
                });
        }
    }
}