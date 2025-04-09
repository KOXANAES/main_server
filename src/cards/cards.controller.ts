import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dtos/createCard.dto';
import { Response } from 'express';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  
  @Post('create')
  async create(@Body() cardDto: CreateCardDto, @Res() res: Response) { 
    try { 
      const createdCard = await this.cardsService.create(cardDto)
      return res.json(createdCard); 
    } catch (e) { 
      console.error('Card creation error:', e);
      return res.status(500).json({ message: 'Card creation failed', error: e.message });
    }
  }

  @Get('getCards')
  async getCards(@Res() res: Response) { 
    try { 
      const cards = await this.cardsService.getCards();
      return res.json(cards); 
    } catch (e) { 
      console.error('Card fetching error:', e);
      return res.status(500).json({ message: 'Card creation failed', error: e.message });
    }
  }

}