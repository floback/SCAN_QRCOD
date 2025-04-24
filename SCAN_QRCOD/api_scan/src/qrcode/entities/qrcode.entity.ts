// src/qrcode/entities/qrcode.entity.ts
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
  user: UserEntity;

  @Column()
  code: string; // código gerado para montar o link do QR

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'text' })
  img: string; // salvando a imagem base64 do QR Code

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;
}
