import { Test, TestingModule } from '@nestjs/testing';
import { PointController } from './point.controller';

describe('PointController', () => {
  let controller: PointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointController],
    }).compile();

    controller = module.get<PointController>(PointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
