import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BlobService } from 'src/services/blob.service';

@Injectable()
export class UploadListener {
    constructor(private readonly blobService: BlobService) { }


    @OnEvent('csv.closed')
    async handleCsvClosedEvent(fileName: string) {
        await this.blobService.upload(fileName);
        return "uploaded";
    }
}