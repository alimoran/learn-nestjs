import { IsString, MinLength, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsNumber()
  blogId: number;

  @IsNumber()
  userId: number;
} 