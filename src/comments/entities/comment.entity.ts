import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticket_comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'comment' })
  text: string;

  @ManyToOne(() => Ticket, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
