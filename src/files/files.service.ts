import * as fs from 'node:fs'
import * as path from 'node:path'
import { InjectQueue } from '@nestjs/bull'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Queue } from 'bull'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('file-processing') private readonly fileQueue: Queue,
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ]
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type')
    }

    const maxSize = this.configService.get('MAX_FILE_SIZE') || 5242880
    if (file.size > maxSize) {
      throw new BadRequestException('File too large')
    }

    const uploadDir = this.configService.get('UPLOAD_DEST') || './uploads'

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileExtension = path.extname(file.originalname)
    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, file.buffer)

    if (file.mimetype.startsWith('image/')) {
      await this.fileQueue.add('process-image', {
        filePath,
        fileName,
        userId,
      })
    }

    return fileName
  }

  async deleteFile(fileName: string): Promise<void> {
    const uploadDir = this.configService.get('UPLOAD_DEST') || './uploads'
    const filePath = path.join(uploadDir, fileName)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  getFileUrl(fileName: string): string {
    return `/uploads/${fileName}`
  }
}
