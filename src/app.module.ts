import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './modules/member/member.module';
import { PointModule } from './modules/point/point.module';
import { Member } from './modules/member/entities/member.entity';
import { MemberLoyalty } from './modules/member/entities/member-loyalty.entity';
import { MemberLog } from './modules/member/entities/member-log.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Point } from './modules/point/entities/point.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './core/audit-log/audit-log.schema';
import { AuditLogInterceptor } from './core/interceptors/audit-log.interceptor';
import { RequestContextModule } from '@medibloc/nestjs-request-context';
import { AuditServiceLogCtx } from './core/constants/audit-log.constant';
import { AuditLogModule } from './core/audit-log/audit-log.module';
import { MemberSubscriber } from './modules/member/subscribers/member.subscriber';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ElasticsearchService } from './shared/elasticsearch/elasticsearch.service';

const registerModule = [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'dD8mABPtSm5xaeeq',
    database: 'development_solva_mall',
    // entities: [__dirname + "/../src/modules/**/*.entity.ts"],
    entities: [Member, MemberLoyalty, MemberLog, Point],
    synchronize: true,
    logging: true,
    cache: {
      type: 'redis',
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
    subscribers: [MemberSubscriber],
  }),
  EventEmitterModule.forRoot(),
  MongooseModule.forRoot('mongodb://localhost/example-app'),
  RequestContextModule.forRoot({
    contextClass: AuditServiceLogCtx,
    isGlobal: true,
  }),
  ClientsModule.register([
    {
      name: 'REDIS-TRANSPORT',
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  ]),
];

@Module({
  imports: [...registerModule, MemberModule, PointModule, AuditLogModule],
  controllers: [AppController],
  providers: [AppService, ElasticsearchService],
})
export class AppModule {}
