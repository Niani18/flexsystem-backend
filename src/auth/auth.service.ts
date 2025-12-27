import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientService } from '../client/client.service.js';
import { JwtService } from '@nestjs/jwt';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { User } from './interface/user.entity.js';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ClientRegisterDTO, DealerRegisterDTO } from './dto/user-register.dto.js';
import { Role } from './role.enum.js';
import { ClientCreateDTO } from '../client/dto/client.dto.js';
import { Public } from '../shared/decorators.js';
import { DealerCreateDTO } from '../dealer/dto/dealer.dto.js';
import { DealerService } from '../dealer/dealer.service.js';
import { DealerState } from '../dealer/interface/dealer.entity.js';

@Injectable()
@Public()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    private em: EntityManager,
    private clientRepo: ClientService, 
    private dealerRepo: DealerService, 
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
  
    const user = await this.userRepository.findOneOrFail({username}, 
      {
        populate: ['client', 'dealer'],
        failHandler: () => new UnauthorizedException('Invalid credentials')
      }
    )

    if (user && user.password !== pass)
      throw new UnauthorizedException('Invalid credentials');

    if(user.dealer && user.dealer.state == DealerState.Down)
      throw new UnauthorizedException('You are fucking unemployed! 🖕💩💩');

    const payload = { 
      clientId: user.client?.id, 
      dealerId: user.dealer?.id, 
      username: user.username, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async signUpClient(userData: ClientRegisterDTO): Promise<User> {
    (userData as User).role = [Role.Client];
    const {client, ...isolatedUser } = userData;
    if(isolatedUser && isolatedUser.password !== isolatedUser.passwordConfirm) 
      throw new UnauthorizedException('Password and config do not match');
    const user = this.userRepository.create(isolatedUser);
    await this.em.persistAndFlush(user);
    this.clientRepo.create({...client, user } as ClientCreateDTO);
    return user;
  }

  async signUpDealer(userData: DealerRegisterDTO): Promise<User> {
    (userData as User).role = [Role.Dealer];
    const {dealer, ...isolatedUser } = userData;
    if(isolatedUser && isolatedUser.password !== isolatedUser.passwordConfirm) 
      throw new UnauthorizedException('Password and config do not match');
    const user = this.userRepository.create(isolatedUser);
    await this.em.persistAndFlush(user);
    this.dealerRepo.create({...dealer, user } as DealerCreateDTO);
    return user;
  }
}
