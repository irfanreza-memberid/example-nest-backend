import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClientRedis } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { IMicroservice } from 'src/core/microservices/microservice.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  DataSource,
} from 'typeorm';
import { MemberLoyalty } from '../member/entities/member-loyalty.entity';
import { Member } from '../member/entities/member.entity';
import { MemberService } from '../member/member.service';
import { AddPointMemberRequest } from './dtos/point.dto';
import { Point } from './entities/point.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepo: Repository<Point>,
    private readonly memberService: MemberService,
    private readonly dataSource: DataSource,
    @Inject('REDIS-TRANSPORT')
    private readonly client: ClientRedis,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async findOnePointByAttribute(option: FindOneOptions<Point>): Promise<Point> {
    return await this.pointRepo.findOne(option);
  }

  async findPointByAttribute(option: FindManyOptions<Point>): Promise<Point[]> {
    return await this.pointRepo.find(option);
  }

  async addPointMember(input: Point): Promise<[Member, MemberLoyalty]> {
    const rollback: any[] = [];
    const transaction = this.dataSource.createQueryRunner();
    await transaction.startTransaction();
    const entityManager = this.dataSource.createEntityManager();
    try {
      await entityManager.save(Point, this.pointRepo.create({ ...input }));
      // await this.pointRepo.save(this.pointRepo.create({ ...input }));
      const member = await this.memberService.addPointMember(
        input.memberId,
        input.point,
        entityManager,
      );
      const ICreateCoffee: IMicroservice = {
        requestId: this.request['requestId'],
        pattern: 'create.coffee',
        body: {
          memberId: input.memberId,
        },
      };
      const testCallRedis = this.client.send(
        ICreateCoffee.pattern,
        ICreateCoffee,
      );
      const resultCall = await lastValueFrom(testCallRedis);
      if (!resultCall) throw new BadRequestException('error create coffee');
      rollback.push(resultCall);
      // throw new BadRequestException('error apa aja');
      transaction.commitTransaction();
      return member;
    } catch (error) {
      transaction.rollbackTransaction();
      this.client.emit('rollback', rollback);
      throw new HttpException(error.message, error.status);
      // throw new HttpException(error.message);
    }
  }
}
