import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCardDto } from './dtos/createCard.dto';
import { GetCardDto } from './dtos/getCards.dto';

@Injectable()
export class CardsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(cardDto: CreateCardDto) { 
        const newCard = await this.prisma.card.create({
            data: {
                isChecked: cardDto.isChecked,
                homeType: cardDto.homeType,
                city: cardDto.city,
                street: cardDto.street,
                home: cardDto.home,
                apartment: cardDto.apartment,
                rooms: cardDto.rooms,
                apis: cardDto.apis,
                faultyapis: cardDto.faultyapis,
                nobatteryapis: cardDto.nobatteryapis,
                heating: cardDto.heating,
                ovens: cardDto.ovens,
                usedovens: cardDto.usedovens,
                faultyovens: cardDto.faultyovens,
                residents: {
                    create: cardDto.residents.map(resident => ({
                    name: resident.name,
                    surname: resident.surname,
                    paternity: resident.paternity,
                    birth: resident.birth,
                    cardId: resident.cardId,
                })),},
                category: cardDto.category,
                nliv: cardDto.nliv,
                cnchildliv: cardDto.cnchildliv,
                other: cardDto.other,
                criterias: cardDto.criterias,
                violations: cardDto.violations,
                creationDate: cardDto.creationDate,
                inspectionDate: cardDto.inspectionDate,
                inspectionDeadline: cardDto.inspectionDeadline,
                creatorId: cardDto.creatorId,
                inspectorId: cardDto.inspectorId,
                instructured: cardDto.instructured,
                isWithSocials: cardDto.isWithSocials,
            },
        });
    
        return newCard;
    }   

    async getCards() { 
        try { 
            const cards = await this.prisma.card.findMany({ 
                include: {
                    creator: { 
                        select: {
                            username: true
                        }
                    }, 
                    inspector: { 
                        select: { 
                            username: true
                        }
                    }
                }
            })
            const filteredCards: GetCardDto[] = cards.map(({ inspectorId, creatorId, creator, inspector, ...rest }) => ({ 
                ...rest,
                creatorUsername: creator?.username,
                inspectorUsername: inspector?.username
            }));
    
            return filteredCards;
        } catch(e) { 
            console.log(e)
            throw e;
        }
    }
}
