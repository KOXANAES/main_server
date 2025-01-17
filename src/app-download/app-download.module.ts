import { Module } from '@nestjs/common';
import { AppDownloadService } from './app-download.service';
import { AppDownloadController } from './app-download.controller';

@Module({
  controllers: [AppDownloadController],
  providers: [AppDownloadService],
})
export class AppDownloadModule {}
