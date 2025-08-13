import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-processing',
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
