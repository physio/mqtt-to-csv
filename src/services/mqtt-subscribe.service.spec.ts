import { Test, TestingModule } from '@nestjs/testing';
import { MqttSubscribeService } from './mqtt-subscribe.service';

describe('MqttSubscribeService', () => {
  let service: MqttSubscribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MqttSubscribeService],
    }).compile();

    service = module.get<MqttSubscribeService>(MqttSubscribeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
