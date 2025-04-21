import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('login')
export class LoginEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => UserEntity, (user) => user.logins)
  @JoinColumn({ name: 'id_user' })
  user: UserEntity;
}
