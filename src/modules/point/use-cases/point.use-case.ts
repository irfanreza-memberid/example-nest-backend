import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddPointMemberRequest,
  AddPointMemberResponse,
} from '../dtos/point.dto';
import { Point } from '../entities/point.entity';
import { MemberService } from '../../member/member.service';
import { Member } from 'src/modules/member/entities/member.entity';
import { MemberLoyalty } from 'src/modules/member/entities/member-loyalty.entity';
@Injectable()
export class PointUseCase {
  constructor(private readonly memberService: MemberService) {}
  async addPointInput(input: AddPointMemberRequest): Promise<Point> {
    const member = await this.memberService.findOneMemberByAttribute({
      where: { memberCode: input.memberCode },
    });
    if (!member)
      throw new HttpException('Member not found!', HttpStatus.NOT_FOUND);
    const point = new Point();
    point.memberId = member.id;
    point.point = input.point;
    return point;
  }

  addPointOutput(
    member: Member,
    memberLoyalty: MemberLoyalty,
  ): AddPointMemberResponse {
    return {
      fullname: member.fullname,
      totalPointBalance: memberLoyalty?.totalPointBalance || 0,
    };
  }
}
