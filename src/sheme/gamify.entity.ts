import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_gamify_profiles')
export class Gamify {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.gamifyProfile , {
    onDelete: 'CASCADE',
    })

    @JoinColumn({name: 'user.id'})
    user:User

    @Column({ type: 'int' })
    xp: number;

    @Column({ type: 'int' })
    currentStreak: number;

    @Column('text', { array: true, default: [] })
    Achiwements: string[];

    @Column()
    lastActivity: string;

    @Column()


    @Column({ type: 'int', default: 0 })
    leaderboardPosition: number;

    @CreateDateColumn()
    completedAt: Date;
}