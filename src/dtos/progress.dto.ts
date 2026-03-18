import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateProgressDto {
  @IsUUID()
  problemId!: string;

  @IsBoolean()
  completed!: boolean;
}
