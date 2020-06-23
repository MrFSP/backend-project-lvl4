import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Tag from './Tag';
import User from './User';

@Entity()
class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = null;

  @Column('varchar')
  @IsNotEmpty()
  name = '';

  @Column('text')
  description = '';

  @Column('varchar')
  @IsNotEmpty()
  status = '';

  @ManyToOne(
    () => User,
    user => user.tasksOwner,
    { eager: true, cascade: true }
  )
  creator = Promise;

  @ManyToOne(
    () => User,
    user => user.tasksExecutor,
    { eager: true, cascade: true }
  )
  assignedTo = Promise;

  @ManyToMany(
    () => Tag,
    tag => tag.tasks,
    { eager: true, cascade: true }
  )
  @JoinTable()
  tags = Promise;
}

export default Task;