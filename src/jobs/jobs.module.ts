import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { JobsController } from './jobs.controller'
import { JobsService } from './jobs.service'
import { FileProcessor } from './processors/file.processor'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-processing',
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, FileProcessor],
  exports: [JobsService],
})
export class JobsModule {}
