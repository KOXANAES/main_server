import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';

@Controller('app-download')
export class AppDownloadController {
  @Get('androidApp')
  getFile(@Res() res: Response) {
    console.log('Функция скачивания приложения начинает работу!`')
    const filePath = join(process.cwd(), 'dist/androidApp/embera.apk');
    const fileStats = statSync(filePath);
    const fileStream = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename=embera.apk',
      'Content-Length': fileStats.size.toString(),
  });

    fileStream.pipe(res);
  }
}