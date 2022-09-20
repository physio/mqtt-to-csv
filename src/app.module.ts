import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttSubscribeService } from './services/mqtt-subscribe.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AppendTelemetryListener, } from './listeners/append-telemetry.listener';
import { BlobService } from './services/blob.service';
import { UploadListener } from './listeners/upload.listener';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { UpdateRedisListener } from './listeners/update-redis.listener';
import * as redisStore from 'cache-manager-redis-store';
import { SendCustomUrlListener } from './listeners/send-custom-url.listener';
import { IotHubService } from './services/iot-hub.service';
import { SendToIotHublListener } from './listeners/send-to-iot-hub.listener';
import { UpdateRedisStreamListener } from './listeners/update-redis-stream.listener';
import { BarcodeService } from './services/barcode.service';
import { OrderNewListener } from './listeners/order-new.listener';
import { ManageCountPiecesListener } from './listeners/manage-count-pieces.listener';
import { PieceFromMqttListener } from './listeners/piece-from-mqtt.listener';
import { AnomalyFromMqttListener } from './listeners/anomaly-from-mqtt.listener';
import { KeyPressService } from './services/keypad.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      retries: 5,
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    AzureStorageModule.withConfig({
      sasKey: process.env.AZURE_STORAGE_SAS_KEY,
      accountName: process.env.AZURE_STORAGE_ACCOUNT,
      containerName: 'upload-file',
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: parseInt(process.env.REDIS_CACHE_TTL),
      auth_pass: process.env.REDIS_PASSWORD,
    }),
  ],
  controllers: [AppController],
  providers: [
    SendToIotHublListener,
    AppendTelemetryListener,
    SendCustomUrlListener,
    UpdateRedisListener,
    UpdateRedisStreamListener,
    OrderNewListener,
    ManageCountPiecesListener,
    UploadListener,
    PieceFromMqttListener,
    AnomalyFromMqttListener,
    BlobService,
    BarcodeService,
    AppService,
    MqttSubscribeService,
    IotHubService,
    KeyPressService,
    TasksService,
  ],
})
export class AppModule { }
