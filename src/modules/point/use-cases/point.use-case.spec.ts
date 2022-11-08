import { Test, TestingModule } from '@nestjs/testing';
import { PointUseCase } from './point.use-case';

describe('PointUseCase', () => {
  let provider: PointUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointUseCase],
    }).compile();

    provider = module.get<PointUseCase>(PointUseCase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
