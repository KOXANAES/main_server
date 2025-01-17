import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('app-download')
export class AppDownloadController {
  @Get('androidApp')
  getFile(@Res() res: Response) {
    const filePath = join(process.cwd(), 'dist/androidApp/app-debug.apk');
    const fileStream = createReadStream(filePath);

    res.set({
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename=app-debug.apk',
    });

    fileStream.pipe(res);
  }
}