import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QrcodeEntity } from '../../qrcode/entities/qrcode.entity';

@Entity('scan')
export class ScanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QrcodeEntity, (qrcode) => qrcode.scan, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_qrcode' })
  qrcode: QrcodeEntity;

  @Column()
  qrId: string;

  @Column()
  ip: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  region: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;
}
