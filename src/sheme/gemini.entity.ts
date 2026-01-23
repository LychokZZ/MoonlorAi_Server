import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

interface StateData {
    model: string; 
    systemInstruction: string;
    history: { role: string; parts: { text: string }[] }[];
}
interface state{
    state: StateData
}
@Entity('user_gemini_profiles')
export class Gemini {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.geminiProfile , {
    onDelete: 'CASCADE',
    })

    @JoinColumn({name: 'user.id'})
    user:User

    @Column({default:''})
    Summary:string

    @Column({ type: 'json', nullable: true })
    state: state;
}