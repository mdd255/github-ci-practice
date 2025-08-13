import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../common/entities/base.entity'
import { User } from '../../users/entities/user.entity'

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  title: string

  @Column('text')
  content: string

  @Column({ default: true })
  isPublished: boolean

  @Column({ nullable: true })
  image: string

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User
}
