import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttSubscribeService } from './services/mqtt-subscribe.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { TelemetryNewListener } from './listeners/telemetry-new.listener';
import { BlobService } from './services/blob.service';
import { UploadListener } from './listeners/upload.listener';
import { AzureStorageModule } from '@nestjs/azure-storage';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    AzureStorageModule.withConfig({
      sasKey: process.env.AZURE_STORAGE_SAS_KEY,
      accountName: process.env.AZURE_STORAGE_ACCOUNT,
      containerName: 'upload-file',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MqttSubscribeService,
    TelemetryNewListener,
    UploadListener,
    BlobService
  ],
})
export class AppModule { }
