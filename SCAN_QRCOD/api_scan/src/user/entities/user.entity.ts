import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserType } from '../dto/create-user.dto';
import { QrcodeEntity } from 'src/qrcode/entities/qrcode.entity';

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

  @OneToMany(() => QrcodeEntity, (qrcode) => qrcode.user) 
  qrcodes: QrcodeEntity[];
}
