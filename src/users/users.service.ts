import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    })

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['posts'],
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      })

      if (existingUser) {
        throw new ConflictException('Email already exists')
      }
    }

    Object.assign(user, updateUserDto)
    return this.userRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.userRepository.remove(user)
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken })
  }
}
