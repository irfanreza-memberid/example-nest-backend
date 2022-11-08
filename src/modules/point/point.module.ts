import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from '../member/member.module';
import { Point } from './entities/point.entity';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { PointUseCase } from './use-cases/point.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Point]),
    forwardRef(() => MemberModule),
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
  ],
  controllers: [PointController],
  providers: [PointService, PointUseCase],
  exports: [PointService],
})
export class PointModule {}
