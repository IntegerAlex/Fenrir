// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  projectName: string;

  @Column()
  status: string;

  @Column()
  time: Date;

  @Column()
  containerId: string;
}
