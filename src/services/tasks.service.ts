import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FileClass } from 'src/classes/file.class';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    @Cron('0 30 22 * * 1-5')
    handleCron() {
        this.logger.debug('Clean older csv files.');
        const task = new FileClass();
        task.delete();
    }

}