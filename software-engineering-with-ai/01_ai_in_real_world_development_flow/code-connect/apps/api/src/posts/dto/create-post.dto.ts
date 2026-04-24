import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Construindo um design system com React' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Neste post vou mostrar como construir um design system escalável com React e TypeScript.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.png' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: ['React', 'TypeScript', 'Front-end'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
