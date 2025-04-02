import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column()
  status: string;

  @Column()
  time: Date;

  @Column()
  containerId: string;
} 