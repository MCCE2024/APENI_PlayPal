import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MatchingService } from './matching.service';
import { MatchingRequest } from './schemas/matching-request.schema';

describe('MatchingService', () => {
  let service: MatchingService;
  let model: any;

  const mockMatchingRequest = (data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data),
  });

  const mockModel = {
    find: jest.fn(),
    save: jest.fn(),
    bulkWrite: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        {
          provide: getModelToken(MatchingRequest.name),
          useValue: mockModel,
        },
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: { emit: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
    model = module.get(getModelToken(MatchingRequest.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should filter by userEmail when provided', async () => {
      const userEmail = 'test@example.com';
      const mockResult = [{ userEmail, sport: 'Tennis' }];
      
      model.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await service.findAll(userEmail);

      expect(model.find).toHaveBeenCalledWith({ userEmail });
      expect(result).toEqual(mockResult);
    });

    it('should return empty array when userEmail is NOT provided', async () => {
      const result = await service.findAll(undefined);

      expect(model.find).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('runBatchMatching', () => {
    it('should query for pending requests not yet ended', async () => {
      model.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      await service.runBatchMatching();

      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Pending',
          dateTimeEnd: { $gte: expect.any(Date) },
        }),
      );
    });
  });
});
