import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

@Processor('file-processing')
export class FileProcessor {
  private readonly logger = new Logger(FileProcessor.name)

  @Process('process-image')
  async handleImageProcessing(job: Job) {
    this.logger.log(`Processing image: ${job.data.fileName}`)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    this.logger.log(`Image processed: ${job.data.fileName}`)
  }

  @Process('send-notification')
  async handleNotification(job: Job) {
    this.logger.log(`Sending notification to user: ${job.data.userId}`)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.logger.log(`Notification sent to: ${job.data.userId}`)
  }
}
