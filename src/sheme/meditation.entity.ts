import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Meditation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  bucket: string; // free_meditations

  @Column()
  path: string; // focus/uuid.mp3

  @Column({ type: 'int', nullable: true })
  durationSec?: number;

  @Column({ nullable: true })
  createdByUserId?: string;

  @Column({ default: true })
  isFree: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
