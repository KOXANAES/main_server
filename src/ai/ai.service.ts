import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {

    async handleQuestion(q: string) { 
        const ans = q
        return ans
    }

}
