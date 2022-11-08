import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { Point } from 'src/modules/point/entities/point.entity';
import {
  CreateMemberRequest,
  CreateMemberResponse,
  GetMemberResponse,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from '../dtos/member.dto';
import { MemberLoyalty } from '../entities/member-loyalty.entity';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberUseCase {
  constructor(
    @Inject('REDIS-TRANSPORT')
    private readonly client: ClientRedis,
  ) {}
  createMemberInput(input: CreateMemberRequest): Member {
    const member = new Member();
    member.referalCode = input.referalCode;
    member.email = input.email;
    member.fullname = input.fullname;
    member.memberCode = this.rand(6);
    member.phoneCode = input.phone.substring(1, 3);
    member.phoneNumber = input.phone.substring(3);
    return member;
  }

  createMemberOutput(
    member: Member,
    memberLoyalty: MemberLoyalty,
  ): CreateMemberResponse {
    return {
      email: member.email,
      fullname: member.fullname,
      memberCode: member.memberCode,
      phone: `${member.phoneCode}${member.phoneNumber}`,
      loyalty: {
        totalPointBalance: memberLoyalty.totalPointBalance,
      },
    };
  }

  updateMemberInput(input: UpdateMemberRequest): Member {
    const member = new Member();
    member.fullname = input.fullname;
    return member;
  }

  updateMemberOutput(member: Member): UpdateMemberResponse {
    return {
      email: member.email,
      fullname: member.fullname,
      memberCode: member.memberCode,
      phone: `${member.phoneCode}${member.phoneNumber}`,
    };
  }

  async getMemberOutput(
    member: Member,
    memberLoyalty: MemberLoyalty,
    point: Point[],
  ): Promise<GetMemberResponse> {
    let resultCall: any;
    try {
      const testCallRedis = this.client.send('get.test', {});
      resultCall = await lastValueFrom(testCallRedis);
    } catch (error) {}
    return {
      email: member.email,
      fullname: member.fullname,
      memberCode: member.memberCode,
      phone: `${member.phoneCode}${member.phoneNumber}`,
      loyalty: {
        totalPointBalance: memberLoyalty?.totalPointBalance || 0,
      },
      point,
      coffee: resultCall ?? [],
    };
  }

  private rand(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
