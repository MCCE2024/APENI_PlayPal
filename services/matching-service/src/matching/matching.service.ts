import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchingRequest, RequestStatus } from './schemas/matching-request.schema';
import { CreateMatchingRequestDto } from './dto/create-matching-request.dto';

@Injectable()
export class MatchingService {
  // Logger for better cron job visibility
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    @InjectModel(MatchingRequest.name)
    private readonly matchingRequestModel: Model<MatchingRequest>,
  ) {}

  async create(createDto: CreateMatchingRequestDto): Promise<MatchingRequest> {
    const newRequest = new this.matchingRequestModel(createDto);
    return newRequest.save();
  }

  async findAll(): Promise<MatchingRequest[]> {
    return this.matchingRequestModel.find().exec();
  }

  /**
   * This Cron job runs automatically every 5 minutes.
   * It finds all pending requests and attempts to create as many matches as possible.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('Running batch matching process...');
    const result = await this.runBatchMatching();
    this.logger.log(`Batch matching process finished. ${result.matchesMade} matches created.`);
  }

  /**
   * The core batch matching algorithm.
   */
  async runBatchMatching(): Promise<{ matchesMade: number }> {
    // 1. Find all eligible requests (pending and starting at least 1 hour from now)
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const pendingRequests = await this.matchingRequestModel.find({
      status: RequestStatus.PENDING,
      dateTimeStart: { $gte: oneHourFromNow },
    }).sort({ createdAt: 'asc' }); // Process older requests first

    if (pendingRequests.length < 2) {
      return { matchesMade: 0 };
    }

    // 2. Group requests by their hard constraints (sport-level-location)
    const requestGroups = new Map<string, MatchingRequest[]>();
    for (const req of pendingRequests) {
      const key = `${req.sport}-${req.level}-${req.location}`;
      if (!requestGroups.has(key)) {
        requestGroups.set(key, []);
      }
      requestGroups.get(key)!.push(req);
    }

    let matchesMade = 0;
    
    // 3. Iterate through each group and attempt to match pairs
    for (const group of requestGroups.values()) {
      while (group.length >= 2) {
        const requester = group.shift()!; // Take the first person from the group
        let matchedPartnerIndex = -1;

        // Find the first available partner with an overlapping time window
        for (let i = 0; i < group.length; i++) {
          const partner = group[i];
          const hasOverlap = 
            requester.dateTimeStart <= partner.dateTimeEnd &&
            requester.dateTimeEnd >= partner.dateTimeStart;

          if (hasOverlap) {
            matchedPartnerIndex = i;
            break;
          }
        }

        if (matchedPartnerIndex !== -1) {
          const partner = group.splice(matchedPartnerIndex, 1)[0];
          
          // 4. Update both requests in the database
          await this.createMatch(requester, partner);
          matchesMade++;
        }
      }
    }

    return { matchesMade };
  }

  private async createMatch(req1: MatchingRequest, req2: MatchingRequest) {
    const now = new Date();
    await this.matchingRequestModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: req1._id },
          update: { $set: { status: RequestStatus.MATCHED, matchedWithRequestId: req2._id, updatedAt: now } },
        },
      },
      {
        updateOne: {
          filter: { _id: req2._id },
          update: { $set: { status: RequestStatus.MATCHED, matchedWithRequestId: req1._id, updatedAt: now } },
        },
      },
    ]);
    
    this.logger.log(`Created match: ${req1.userEmail} vs ${req2.userEmail}`);
    // In a real app, you would emit an event here to notify users
  }
}