import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MatchingService } from './matching.service';
import {
  MatchingRequest,
  RequestStatus,
} from './schemas/matching-request.schema';

describe('MatchingService Overlap Logic', () => {
  let service: MatchingService;
  let notificationClient: { emit: jest.Mock };
  let model: { find: jest.Mock; bulkWrite: jest.Mock };

  beforeEach(async () => {
    notificationClient = { emit: jest.fn() };
    model = {
      find: jest.fn(),
      bulkWrite: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        {
          provide: getModelToken(MatchingRequest.name),
          useValue: model,
        },
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: notificationClient,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) =>
              key === 'KAFKA_TOPIC' ? 'matches.matched' : null,
            ),
          },
        },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
  });

  it('should calculate correct overlap for notifications', async () => {
    // Setup two requests with overlapping times
    // User A: 21:00 - 22:00
    // User B: 21:00 - 23:00
    // Expected Match: 21:00 - 22:00

    // Use a fixed date in future
    const baseDate = '2026-01-29';
    const req1 = {
      _id: 'req1',
      userEmail: 'userA@example.com',
      sport: 'Tennis',
      level: 'Beginner',
      location: 'Park',
      dateTimeStart: new Date(`${baseDate}T21:00:00Z`),
      dateTimeEnd: new Date(`${baseDate}T22:00:00Z`),
      status: RequestStatus.PENDING,
    } as unknown as MatchingRequest;
    const req2 = {
      _id: 'req2',
      userEmail: 'userB@example.com',
      sport: 'Tennis',
      level: 'Beginner',
      location: 'Park',
      dateTimeStart: new Date(`${baseDate}T21:00:00Z`),
      dateTimeEnd: new Date(`${baseDate}T23:00:00Z`),
      status: RequestStatus.PENDING,
    } as unknown as MatchingRequest;

    // Mock finding these requests
    model.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([req1, req2]),
    });

    // Run matching
    await service.runBatchMatching();

    // Verify bulkWrite (status update)
    expect(model.bulkWrite).toHaveBeenCalled();

    // Verify Notification emit
    // We expect 2 calls (one for each user)
    expect(notificationClient.emit).toHaveBeenCalledTimes(2);

    // Expected Overlap
    const expectedStart = new Date(`${baseDate}T21:00:00Z`).toISOString();
    const expectedEnd = new Date(`${baseDate}T22:00:00Z`).toISOString();

    // Check payload for User A
    expect(notificationClient.emit).toHaveBeenCalledWith(
      'matches.matched',
      expect.objectContaining({
        recipientEmail: 'userA@example.com',
        opponent: expect.objectContaining({
          email: 'userB@example.com',
          dateTimeStart: expectedStart,
          dateTimeEnd: expectedEnd,
        } as Record<string, unknown>),
      } as Record<string, unknown>),
    );

    // Check payload for User B
    expect(notificationClient.emit).toHaveBeenCalledWith(
      'matches.matched',
      expect.objectContaining({
        recipientEmail: 'userB@example.com',
        opponent: expect.objectContaining({
          email: 'userA@example.com',
          dateTimeStart: expectedStart,
          dateTimeEnd: expectedEnd,
        } as Record<string, unknown>),
      } as Record<string, unknown>),
    );
  });
});
