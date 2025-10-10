import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchingRequest, MatchingRequestSchema } from './schemas/matching-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MatchingRequest.name, schema: MatchingRequestSchema }]),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}