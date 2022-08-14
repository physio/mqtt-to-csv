import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttSubscribeService } from './services/mqtt-subscribe.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { TelemetryNewListener } from './listeners/telemetry-new.listener';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MqttSubscribeService,
    TelemetryNewListener
  ],
})
export class AppModule { }
