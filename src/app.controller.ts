import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class AppController {

    @Get('/')
    hello(@Res() res: Response) { 
        return res.json('hello from vps main server!')
    }

}
