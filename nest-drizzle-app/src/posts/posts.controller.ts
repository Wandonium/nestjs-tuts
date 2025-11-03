import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() request: CreatePostDto) {
    return this.postsService.createPost(
      {
        content: request.content,
        userId: request.userId,
      },
      request.category,
    );
  }

  @Get()
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id') postId: string) {
    return this.postsService.getPost(parseInt(postId));
  }

  @Patch(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() request: { content: string },
  ) {
    return this.postsService.updatePost(parseInt(postId), request);
  }
}
