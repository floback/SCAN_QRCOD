import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('qrcode')
export class QrcodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.qrcodes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_user' })
  id_user: UserEntity;

  @Column()
  code: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'text' })
  img: string;

  @Column()
  link_add: string;

  @Column()
  number_fone: number;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;
}
