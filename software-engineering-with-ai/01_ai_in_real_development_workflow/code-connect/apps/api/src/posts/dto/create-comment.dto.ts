import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Excelente post! Aprendi muito com esse conteúdo.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
