import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue('file-processing') private readonly fileQueue: Queue,
  ) {}

  async addNotificationJob(userId: string, message: string) {
    return this.fileQueue.add('send-notification', {
      userId,
      message,
    })
  }

  async getQueueStatus() {
    const waiting = await this.fileQueue.getWaiting()
    const active = await this.fileQueue.getActive()
    const completed = await this.fileQueue.getCompleted()
    const failed = await this.fileQueue.getFailed()

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    }
  }
}
