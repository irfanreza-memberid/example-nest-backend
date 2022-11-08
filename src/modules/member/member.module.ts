import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointModule } from '../point/point.module';
import { MemberLog } from './entities/member-log.entity';
import { MemberLoyalty } from './entities/member-loyalty.entity';
import { Member } from './entities/member.entity';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberUseCase } from './use-cases/member.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberLog, MemberLoyalty]),
    forwardRef(() => PointModule),
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
  controllers: [MemberController],
  providers: [MemberService, MemberUseCase],
  exports: [MemberService],
})
export class MemberModule {}
