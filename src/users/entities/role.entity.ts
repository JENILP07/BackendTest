import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRole, unique: true })
  name: UserRole;

  @OneToMany(() => User, (user) => user.roleRef)
  users: User[];
}
