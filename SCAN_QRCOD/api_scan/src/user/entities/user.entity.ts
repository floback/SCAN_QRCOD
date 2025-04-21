import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LoginEntity } from '../../login/entities/login.entity';
import { UserType } from '../dto/create-user.dto';

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

  @Column({ type: 'enum', enum: UserType, default: UserType.user })
  type_user: UserType;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => LoginEntity, (login) => login.user)
  logins: LoginEntity[];
  qrcodes: any;
}
