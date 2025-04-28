import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('qrcode')
export class QrcodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  id_user: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  number_fone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link_add: string;

  @Column({ type: 'text', nullable: true })
  img: string;

  @ManyToOne(() => UserEntity, (user) => user.qrcodes)
  @JoinColumn({ name: 'id_user' }) // <<<<<< AQUI VOCÊ INFORMA O NOME CERTO
  user: UserEntity;
}
