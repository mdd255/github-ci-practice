import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from '../users/entities/user.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post } from './entities/post.entity'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      author,
    })

    return this.postRepository.save(post)
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    })
  }

  async findUserPosts(userId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { author: { id: userId } },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    return post
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOne(id)

    if (post.author.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own posts')
    }

    Object.assign(post, updatePostDto)
    return this.postRepository.save(post)
  }

  async remove(id: string, user: User): Promise<void> {
    const post = await this.findOne(id)

    if (post.author.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own posts')
    }

    await this.postRepository.remove(post)
  }
}
