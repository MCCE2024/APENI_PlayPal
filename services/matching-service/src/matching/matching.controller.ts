import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { CreateMatchingRequestDto } from './dto/create-matching-request.dto';

@Controller('matching-requests')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  /**
   * Endpoint to create a new match request.
   * POST /matching-requests
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateMatchingRequestDto) {
    return this.matchingService.create(createDto);
  }

  /**
   * Manually trigger the batch matching process for all pending requests.
   * Useful for testing.
   * POST /matching-requests/run-batch
   */
  @Post('run-batch')
  @HttpCode(HttpStatus.OK)
  runBatch() {
    // We don't await this so the HTTP request returns immediately
    // The batch job will run in the background.
    this.matchingService.runBatchMatching();
    return { message: 'Batch matching process initiated.' };
  }
}