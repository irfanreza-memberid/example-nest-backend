import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { METADATA_AUDITLOG } from 'src/core/constants/audit-log.constant';
import { InsertAuditUseCaseCtx } from 'src/core/helpers/insert-ctx.helper';
import { ResponseTransformationInterceptor } from 'src/core/interceptors/base-response.interceptor';
import { BaseResponseSuccess } from 'src/core/interfaces/base-response.interface';
import {
  CreateMemberRequest,
  CreateMemberResponse,
  GetMemberResponse,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from './dtos/member.dto';
import { MemberService } from './member.service';
import { MemberUseCase } from './use-cases/member.use-case';

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberUseCase: MemberUseCase,
    private readonly memberService: MemberService,
  ) {}

  @Post()
  async createMember(
    @Body() input: CreateMemberRequest,
  ): Promise<CreateMemberResponse> {
    /** untuk refactor object body jadi entity */
    const createMemberUseCase = this.memberUseCase.createMemberInput(input);

    /** create data action */
    const create = await this.memberService.createMember(createMemberUseCase);

    /** BFF */
    const response = this.memberUseCase.createMemberOutput(
      create.member,
      create.loyalty,
    );
    return response;
  }

  @Put(':id')
  async updateMember(
    @Param('id') id: string,
    @Body() input: UpdateMemberRequest,
  ): Promise<UpdateMemberResponse> {
    const updateMemberUsecase = this.memberUseCase.updateMemberInput(input);
    const update = await this.memberService.updateMember(
      Number(id),
      updateMemberUsecase,
    );
    const response = this.memberUseCase.updateMemberOutput(update);
    return response;
  }

  @Get(':id')
  async getMember(@Param('id') id: string): Promise<GetMemberResponse> {
    const getData = await this.memberService.getMember(Number(id));
    const response = await this.memberUseCase.getMemberOutput(...getData);
    return response;
  }
}
