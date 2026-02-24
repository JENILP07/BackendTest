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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('tickets/:ticketId/comments')
  @ApiOperation({ summary: 'Add a comment to a ticket' })
  create(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.create(ticketId, createCommentDto, user);
  }

  @Get('tickets/:ticketId/comments')
  @ApiOperation({ summary: 'List comments for a ticket' })
  findByTicket(@Param('ticketId', ParseIntPipe) ticketId: number, @GetUser() user: User) {
    return this.commentsService.findByTicket(ticketId, user);
  }

  @Patch('comments/:id')
  @ApiOperation({ summary: 'Edit comment (author or MANAGER)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment (Author or Manager only)' })
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    await this.commentsService.remove(id, user);
  }
}
