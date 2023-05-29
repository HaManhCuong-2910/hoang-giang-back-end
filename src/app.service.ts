import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  //   @Cron(CronExpression.EVERY_30_SECONDS)
  //   handleCron() {
  //     console.log('cron..,,,, 30s');
  //   }
}
