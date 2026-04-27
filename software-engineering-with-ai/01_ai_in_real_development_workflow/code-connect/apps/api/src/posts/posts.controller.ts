import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Listar posts com busca e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de posts paginada' })
  findAll(@Query() query: QueryPostsDto, @Request() req: { user?: { id: string } }) {
    return this.postsService.findAll(query, req.user?.id);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Buscar post por ID' })
  @ApiResponse({ status: 200, description: 'Post encontrado' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  findOne(@Param('id') id: string, @Request() req: { user?: { id: string } }) {
    return this.postsService.findById(id, req.user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo post' })
  @ApiResponse({ status: 201, description: 'Post criado' })
  create(@Body() dto: CreatePostDto, @Request() req: { user: { id: string } }) {
    return this.postsService.create(dto, req.user.id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar comentário ao post' })
  @ApiResponse({ status: 201, description: 'Comentário adicionado' })
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.postsService.addComment(id, dto, req.user.id);
  }

  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Curtir/descurtir post (toggle)' })
  @ApiResponse({ status: 200, description: 'Like alternado' })
  toggleLike(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.postsService.toggleLike(id, req.user.id);
  }
}
