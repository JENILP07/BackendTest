import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
  ) {}

  private async findTicketWithAccess(ticketId: number, user: User): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['creator', 'assignee'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (user.role === UserRole.MANAGER) {
      return ticket;
    }
    if (user.role === UserRole.SUPPORT && ticket.assignee?.id === user.id) {
      return ticket;
    }
    if (user.role === UserRole.USER && ticket.creator.id === user.id) {
      return ticket;
    }

    throw new ForbiddenException('You are not allowed to comment on this ticket');
  }

  async create(ticketId: number, dto: CreateCommentDto, author: User) {
    const ticket = await this.findTicketWithAccess(ticketId, author);
    const comment = this.commentRepo.create({
      text: dto.text,
      ticket: { id: ticket.id } as Ticket,
      author: { id: author.id } as User,
    });
    return this.commentRepo.save(comment);
  }

  async findByTicket(ticketId: number, user: User) {
    await this.findTicketWithAccess(ticketId, user);
    return this.commentRepo.find({
      where: { ticket: { id: ticketId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateCommentDto, user: User) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== user.id && user.role !== UserRole.MANAGER) {
      throw new ForbiddenException('Only author or MANAGER can edit');
    }

    comment.text = dto.text;
    return this.commentRepo.save(comment);
  }

  async remove(id: number, user: User) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== user.id && user.role !== UserRole.MANAGER) {
      throw new ForbiddenException('Only author or MANAGER can delete');
    }

    await this.commentRepo.remove(comment);
  }
}
