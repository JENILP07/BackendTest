import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ParseIntPipe,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignTicketDto } from './dto/assign-ticket.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new support ticket' })
  create(@Body() createTicketDto: CreateTicketDto, @GetUser() user: User) {
    return this.ticketsService.create(createTicketDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List tickets (MANAGER=all, SUPPORT=assigned, USER=own)' })
  findAll(@GetUser() user: User) {
    return this.ticketsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific ticket' })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.ticketsService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPPORT, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update ticket status (Support/Manager only)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateTicketStatusDto,
    @GetUser() user: User,
  ) {
    return this.ticketsService.updateStatus(id, updateStatusDto.status, user);
  }

  @Patch(':id/assign')
  @Roles(UserRole.MANAGER, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Assign ticket (Manager/Support only)' })
  @ApiBody({ type: AssignTicketDto })
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTicketDto: AssignTicketDto,
  ) {
    return this.ticketsService.assign(id, assignTicketDto.assigneeId);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ticket (Manager only)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ticketsService.remove(id);
  }
}
