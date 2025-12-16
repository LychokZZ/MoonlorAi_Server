import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_onboarding_profiles')
export class Onboard {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.onboardingProfile, {
    onDelete: 'CASCADE',
    })

    @JoinColumn({name: 'user.id'})
    user:User

    @Column({ type: 'int' })
    emotionLevel: number;

    @Column({ type: 'int' })
    identityLevel: number;

    @Column({ type: 'int' })
    socialLevel: number;

    @Column({ type: 'int' })
    functionLevel: number;
    
    @CreateDateColumn()
    completedAt: Date;
}