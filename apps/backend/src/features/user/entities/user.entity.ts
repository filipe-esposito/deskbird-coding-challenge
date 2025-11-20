import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// TODO replace with interfaces from shared-lib

@Entity()
export class User {
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
