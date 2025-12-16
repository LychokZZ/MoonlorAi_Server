import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { Onboard } from './onboarding.entity';
import { Gamify } from './gamify.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    Username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: 'user' })
    role: 'user' | 'psychologist';

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: 'UA' })
    Language: string;

    @Column({ nullable: true })
    refreshTokenHash: string | null;

    @OneToOne(() => Onboard,(profile) => profile.user,)
    onboardingProfile: Onboard;

    @OneToOne(() => Gamify,(profile) => profile.user,)
    gamifyProfile: Gamify;
}