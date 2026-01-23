import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_statistic_profiles')
export class Statistic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.statisticProfile, {
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'user.id' })
    user: User

    @Column({ type: 'int' })
    countMeditation: number;

    @Column({ type: 'int' })
    avarageEmotion: number;

    @Column('int', { array: true, default: [] })
    avarageEmotionList: number[];

    @Column({ type: 'int' })
    hoursPractic: number;

}