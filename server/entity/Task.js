import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Tag from './Tag';

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

  @Column('varchar')
  @IsNotEmpty()
  creator = '';

  @Column('varchar')
  assignedTo = '';

  @ManyToMany(
    () => Tag,
    tag => tag.tasks,
    { eager: true }
  )
  @JoinTable()
  tags = Promise;
}

export default Task;