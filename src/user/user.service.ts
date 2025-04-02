import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const user = this.userRepository.create({ username, password });
    return this.userRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async trackDeployment(username: string): Promise<void> {
    const key = username.toLowerCase();
    const existing = await this.redisService.get(key);
    if (existing) {
      throw new Error('Deployment limit reached');
    }
    await this.redisService.set(key, 'true');
  }
}
