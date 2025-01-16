import { Resolver, Query } from '@nestjs/graphql';
import { UsersGqlService } from './users-gql.service';
import { UsersService } from 'src/users/users.service';
import { UserModel } from './user.model';

@Resolver()
export class UsersGqlResolver {
  constructor(
    private readonly usersGqlService: UsersGqlService,
    private readonly usersService: UsersService 
  ) {}

  @Query(() => [UserModel], {name: 'getGQLusers'})
  findAll() { 
    return this.usersService.findAll()
  }

}
