import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll(@Query('authorId') authorId?: string) {
    if (authorId) {
      return this.blogsService.findByAuthor(+authorId);
    }
    return this.blogsService.findAll();
  }

  @Get('feed/:userId')
  getFeed(@Param('userId') userId: string) {
    return this.blogsService.getFeed(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: Partial<CreateBlogDto>) {
    return this.blogsService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }

  // Comments endpoints
  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    return this.blogsService.addComment(createCommentDto);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.blogsService.getComments(+id);
  }

  // Likes endpoints
  @Put(':id/like')
  likeBlog(@Param('id') id: string) {
    return this.blogsService.likeBlog(+id);
  }

  @Put(':id/unlike')
  unlikeBlog(@Param('id') id: string) {
    return this.blogsService.unlikeBlog(+id);
  }

  // Following endpoints
  @Post('follow/:userId/:authorId')
  followAuthor(@Param('userId') userId: string, @Param('authorId') authorId: string) {
    return this.blogsService.followAuthor(+userId, +authorId);
  }

  @Post('unfollow/:userId/:authorId')
  unfollowAuthor(@Param('userId') userId: string, @Param('authorId') authorId: string) {
    return this.blogsService.unfollowAuthor(+userId, +authorId);
  }

  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.blogsService.getFollowing(+userId);
  }
} 