import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import {
  MatchingRequest,
  RequestStatus,
} from './schemas/matching-request.schema';
import { CreateMatchingRequestDto } from './dto/create-matching-request.dto';

@Injectable()
export class MatchingService {
  // Logger for better cron job visibility
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    @InjectModel(MatchingRequest.name)
    private readonly matchingRequestModel: Model<MatchingRequest>,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    private readonly configService: ConfigService,
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
    this.logger.log(
      `Batch matching process finished. ${result.matchesMade} matches created.`,
    );
  }

  /**
   * The core batch matching algorithm.
   */
  async runBatchMatching(): Promise<{ matchesMade: number; logs: string[] }> {
    const logs: string[] = [];
    const log = (msg: string) => {
      this.logger.log(msg);
      logs.push(msg);
    };

    // 1. Find all eligible requests (pending and starting in the future)
    const now = new Date();
    const pendingRequests = await this.matchingRequestModel
      .find({
        status: RequestStatus.PENDING,
        dateTimeStart: { $gte: now },
      })
      .sort({ createdAt: 'asc' }); // Process older requests first

    log(
      `Found ${pendingRequests.length} pending requests eligible for matching.`,
    );

    if (pendingRequests.length < 2) {
      return { matchesMade: 0, logs };
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

    log(
      `Created ${requestGroups.size} grouping keys: ${Array.from(requestGroups.keys()).join(', ')}`,
    );

    let matchesMade = 0;

    // 3. Iterate through each group and attempt to match pairs
    for (const [key, group] of requestGroups.entries()) {
      log(`Processing group '${key}' with ${group.length} requests.`);
      while (group.length >= 2) {
        const requester = group.shift()!; // Take the first person from the group
        let matchedPartnerIndex = -1;

        // Find the first available partner with an overlapping time window
        for (let i = 0; i < group.length; i++) {
          const partner = group[i];
          const hasOverlap =
            requester.dateTimeStart <= partner.dateTimeEnd &&
            requester.dateTimeEnd >= partner.dateTimeStart;

          log(
            `Comparing ${String(requester._id)} (${requester.dateTimeStart.toISOString()}-${requester.dateTimeEnd.toISOString()}) with ${String(partner._id)} (${partner.dateTimeStart.toISOString()}-${partner.dateTimeEnd.toISOString()}). Overlap: ${hasOverlap}`,
          );

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
          log(`Matched ${String(requester._id)} with ${String(partner._id)}`);
        } else {
          log(`No partner found for ${String(requester._id)} in group ${key}`);
        }
      }
    }

    return { matchesMade, logs };
  }

  private async createMatch(req1: MatchingRequest, req2: MatchingRequest) {
    const now = new Date();
    await this.matchingRequestModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: req1._id },
          update: {
            $set: {
              status: RequestStatus.MATCHED,
              matchedWithRequestId: req2._id,
              updatedAt: now,
            },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: req2._id },
          update: {
            $set: {
              status: RequestStatus.MATCHED,
              matchedWithRequestId: req1._id,
              updatedAt: now,
            },
          },
        },
      },
    ]);

    this.logger.log(`Created match: ${req1.userEmail} vs ${req2.userEmail}`);

    // Emit events to Kafka with structured data
    // Notify User 1
    this.notificationClient.emit('matches.matched', {
      recipientEmail: req1.userEmail,
      opponent: {
        email: req2.userEmail,
        level: req2.level,
        sport: req2.sport,
        location: req2.location,
        dateTimeStart: req2.dateTimeStart.toISOString(),
        dateTimeEnd: req2.dateTimeEnd.toISOString(),
      },
    });

    // Notify User 2
    this.notificationClient.emit('matches.matched', {
      recipientEmail: req2.userEmail,
      opponent: {
        email: req1.userEmail,
        level: req1.level,
        sport: req1.sport,
        location: req1.location,
        dateTimeStart: req1.dateTimeStart.toISOString(),
        dateTimeEnd: req1.dateTimeEnd.toISOString(),
      },
    });

    this.logger.log(
      `Sent match notification events for ${req1.userEmail} and ${req2.userEmail}`,
    );
  }
}
