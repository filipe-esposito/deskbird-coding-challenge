import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IUser } from '@deskbird-coding-challenge/shared-lib';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  isAdmin!: boolean;
}
