import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../common/entities/base.entity'
import { Post } from '../../posts/entities/post.entity'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  @Exclude()
  password: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}
