import { IsString, IsEmail, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { SportType, SkillLevel } from '../schemas/matching-request.schema';

export class CreateMatchingRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsEnum(SportType)
  @IsNotEmpty()
  sport: SportType;

  @IsEnum(SkillLevel)
  @IsNotEmpty()
  level: SkillLevel;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  dateTimeStart: string;

  @IsDateString()
  @IsNotEmpty()
  dateTimeEnd: string;
}