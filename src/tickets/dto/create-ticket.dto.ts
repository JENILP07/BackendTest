import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsEnum(TicketPriority)
  @IsNotEmpty()
  priority: TicketPriority;
}
