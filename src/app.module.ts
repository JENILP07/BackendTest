import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/role.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { TicketStatusLog } from './tickets/entities/ticket-status-log.entity';
import { Comment } from './comments/entities/comment.entity';
import { TicketsModule } from './tickets/tickets.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        if (url) {
          return {
            type: 'postgres',
            url,
            entities: [Role, User, Ticket, TicketStatusLog, Comment],
            synchronize: true,
            ssl: url.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          entities: [Role, User, Ticket, TicketStatusLog, Comment],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TicketsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
