import { IsNumber, IsString } from 'class-validator';

export class AddPointMemberRequest {
  @IsString()
  memberCode: string;

  @IsNumber()
  point: number;
}

export interface AddPointMemberResponse {
  fullname: string;
  totalPointBalance: number;
}
