import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QrcodeEntity } from '../../qrcode/entities/qrcode.entity';

@Entity('scan_logs')
export class ScanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QrcodeEntity, (qrcode) => qrcode.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_qrcode' })
  qrcode: QrcodeEntity;

  @Column()
  id_qrcode: string;

  @Column()
  ip: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column('float', { nullable: true })
  accuracy: number;

  @Column('float', { nullable: true })
  altitude: number;

  @Column('float', { nullable: true })
  heading: number;

  @Column('float', { nullable: true })
  speed: number;

  @Column()
  region: string;

  @Column('float')
  latitude: number | null;

  @Column('float')
  longitude: number | null;
}
