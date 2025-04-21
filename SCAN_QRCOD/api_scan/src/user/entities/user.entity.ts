import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LoginEntity } from '../../login/entities/login.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => LoginEntity, (login) => login.user)
  logins: LoginEntity[];
  qrcodes: any;
}
