import { Test, TestingModule } from '@nestjs/testing';
import { MemberUseCase } from './member.use-case';

describe('MemberUseCase', () => {
  let provider: MemberUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberUseCase],
    }).compile();

    provider = module.get<MemberUseCase>(MemberUseCase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
