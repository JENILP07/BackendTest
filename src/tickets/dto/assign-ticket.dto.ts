import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AssignTicketDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  assigneeId: number;
}
