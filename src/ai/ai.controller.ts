import { Body, Controller, Post, Res } from '@nestjs/common';
import { AiService } from './ai.service';
import { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}
  
  @Post('askAI')
  async askAI(@Body() q: string, @Res() res: Response) { 
    try {
      const ans = await this.aiService.handleQuestion(q)
      return res.json(ans)
    } catch(e) { 
      console.error('AI questioning error:', e);
      return res.status(500).json({ message: 'AI Questioning failed', error: e.message });
    }
  }

}
