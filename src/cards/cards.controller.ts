import { Body, Controller, Post, Res } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  
  @Post('create')
  async create(@Body() cardDto: CreateCardDto, @Res() res: Response) { 
    try { 
      console.log('hello!')
      await this.cardsService.create(cardDto)
      return 
    } catch (e) { 
      console.error('Registration error:', e);
      // return res.status(500).json({ message: 'Card creation failed', error: e.message });
    }
  }

}
