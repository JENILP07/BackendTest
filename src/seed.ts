import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { TicketsService } from './tickets/tickets.service';
import { UserRole } from './users/entities/user.entity';
import { TicketPriority, TicketStatus } from './tickets/entities/ticket.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const ticketsService = app.get(TicketsService);

  console.log('Seeding data...');

  const admin = await usersService.create({
    name: 'Manager Admin',
    email: 'admin@tms.com',
    password: 'Password123!',
    role: UserRole.MANAGER,
  } as any);
  console.log('Admin created');

  const support1 = await usersService.create({
    name: 'Support One',
    email: 'support1@tms.com',
    password: 'Password123!',
    role: UserRole.SUPPORT,
  } as any);
  const support2 = await usersService.create({
    name: 'Support Two',
    email: 'support2@tms.com',
    password: 'Password123!',
    role: UserRole.SUPPORT,
  } as any);
  console.log('Support staff created');

  const user1 = await usersService.create({
    name: 'User One',
    email: 'user1@tms.com',
    password: 'Password123!',
    role: UserRole.USER,
  } as any);
  const user2 = await usersService.create({
    name: 'User Two',
    email: 'user2@tms.com',
    password: 'Password123!',
    role: UserRole.USER,
  } as any);
  console.log('Users created');

  const ticket1 = await ticketsService.create(
    {
      title: 'Cannot access email',
      description: 'I am getting a 403 error when trying to log in to my company email.',
      priority: TicketPriority.HIGH,
    },
    user1,
  );

  const ticket2 = await ticketsService.create(
    {
      title: 'New laptop request',
      description: 'My current laptop is very slow and the screen is flickering.',
      priority: TicketPriority.MEDIUM,
    },
    user1,
  );

  const ticket3 = await ticketsService.create(
    {
      title: 'VPN connection issues',
      description: 'The VPN disconnects every 10 minutes.',
      priority: TicketPriority.HIGH,
    },
    user2,
  );
  console.log('Tickets created');

  await ticketsService.assign(ticket1.id, support1.id);
  await ticketsService.updateStatus(ticket1.id, TicketStatus.IN_PROGRESS, support1);
  
  await ticketsService.assign(ticket3.id, support2.id);

  console.log('Seeding complete!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
