import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { DifficultyEnum } from '../enums/DifficultyEnum';

export class CreateTopicDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}

export class CreateProblemDto {
  @IsUUID()
  topicId!: string;

  @IsString()
  title!: string;

  @IsEnum(DifficultyEnum)
  difficulty!: DifficultyEnum;

  @IsOptional()
  @IsString()
  youtubeLink?: string;

  @IsOptional()
  @IsString()
  leetcodeLink?: string;

  @IsOptional()
  @IsString()
  codeforcesLink?: string;

  @IsOptional()
  @IsString()
  articleLink?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
