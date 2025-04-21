import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('qrcode')
export class QrcodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.qrcodes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_user' })
  user: UserEntity;

  @Column()
  nome: string;

  @Column({ nullable: true })
  legenda: string;

  @Column({ default: true })
  status: boolean;
  scan: any;
}
