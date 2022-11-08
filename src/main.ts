import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './core/interceptors/sentry.interceptor';
import { AuditLogInterceptor } from './core/interceptors/audit-log.interceptor';
import { ResponseTransformationInterceptor } from './core/interceptors/base-response.interceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ElasticsearchService } from './shared/elasticsearch/elasticsearch.service';
import { ElasticInterceptor } from './core/interceptors/elastic-interceptor';
const logtail = new Logtail('q6N2GRAuDkzTKZfzXxp78SdZ');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: WinstonModule.createLogger({
    //   transports: [
    //     new LogtailTransport(logtail)
    //   ],
    // })
  });
  const elasticsearchService = app.select(AppModule).get(ElasticsearchService);
  app.useGlobalInterceptors(new ElasticInterceptor(elasticsearchService));
  const appMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
  Sentry.init({
    dsn: 'https://19e1ab23d95d493e8a9939a5cfb94cee@o4504060003418112.ingest.sentry.io/4504060203827200',
  });
  // app.useGlobalInterceptors(new SentryInterceptor())
  // app.useGlobalInterceptors(new AuditLogInterceptor())
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalInterceptors(new ResponseTransformationInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  await appMicroservice.listen();
  console.log('Listening port :3000');
}
bootstrap();
