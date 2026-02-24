import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { TicketStatusLog } from './entities/ticket-status-log.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketStatusLog)
    private logRepo: Repository<TicketStatusLog>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateTicketDto, user: User) {
    const ticket = this.ticketRepo.create({
      ...dto,
      creator: { id: user.id } as User,
    });
    return this.ticketRepo.save(ticket);
  }

  async findAll(user: User): Promise<Ticket[]> {
    if (user.role === UserRole.USER) {
      return this.ticketRepo.find({
        where: { creator: { id: user.id } },
        relations: ['creator', 'assignee'],
      });
    }

    if (user.role === UserRole.SUPPORT) {
      return this.ticketRepo.find({
        where: { assignee: { id: user.id } },
        relations: ['creator', 'assignee'],
      });
    }

    return this.ticketRepo.find({ relations: ['creator', 'assignee'] });
  }

  private assertTicketAccess(ticket: Ticket, user: User): void {
    if (user.role === UserRole.MANAGER) {
      return;
    }

    if (user.role === UserRole.SUPPORT && ticket.assignee?.id === user.id) {
      return;
    }

    if (user.role === UserRole.USER && ticket.creator.id === user.id) {
      return;
    }

    throw new ForbiddenException('You are not allowed to access this ticket');
  }

  async findOne(id: number, user: User): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['creator', 'assignee'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    this.assertTicketAccess(ticket, user);
    return ticket;
  }

  async assign(id: number, assigneeId: number) {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const assignee = await this.userRepo.findOne({ where: { id: assigneeId } });
    if (!assignee) {
      throw new NotFoundException('Assignee not found');
    }
    if (assignee.role === UserRole.USER) {
      throw new BadRequestException('Tickets can only be assigned to support staff or managers');
    }

    ticket.assignee = assignee;
    return this.ticketRepo.save(ticket);
  }

  async updateStatus(id: number, newStatus: TicketStatus, user: User) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['creator', 'assignee'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const oldStatus = ticket.status;
    const validNextStatus: Record<TicketStatus, TicketStatus | null> = {
      [TicketStatus.OPEN]: TicketStatus.IN_PROGRESS,
      [TicketStatus.IN_PROGRESS]: TicketStatus.RESOLVED,
      [TicketStatus.RESOLVED]: TicketStatus.CLOSED,
      [TicketStatus.CLOSED]: null,
    };

    if (validNextStatus[oldStatus] !== newStatus) {
      throw new BadRequestException(
        `Invalid status transition from ${oldStatus} to ${newStatus}`,
      );
    }

    ticket.status = newStatus;
    await this.ticketRepo.save(ticket);

    await this.logRepo.save({ ticket, oldStatus, newStatus, changedBy: user });

    return ticket;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ticketRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Ticket not found');
    }
  }
}
