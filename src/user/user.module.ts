import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity with TypeORM
  controllers: [UserController], // Include the user controller
  providers: [UserService], // Include the user service
  exports: [UserService], // Export the service if needed in other modules
})
export class UserModule {}
