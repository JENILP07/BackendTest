import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Ticket, TicketStatus } from './ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticket_status_logs')
export class TicketStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ name: 'old_status', type: 'enum', enum: TicketStatus })
  oldStatus: TicketStatus;

  @Column({ name: 'new_status', type: 'enum', enum: TicketStatus })
  newStatus: TicketStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
