import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientRedis } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('REDIS-TRANSPORT')
    private readonly client: ClientRedis,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const a = this.client
      .send('hero.kill.dragon', {
        message: 'ini message',
      })
      .pipe(timeout(10000));
    console.log(await lastValueFrom(a));
    // console.log(this.client.send('calculate'));
    return this.appService.getHello();
  }
}
