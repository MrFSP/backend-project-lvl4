import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
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

  @OneToOne(() => User)
  @JoinColumn()
  @IsNotEmpty()
  creator = Promise;

  @Column('varchar')
  assignedTo = '';

  @ManyToMany(
    () => Tag,
    tag => tag.tasks,
    { eager: true, cascade: true }
  )
  @JoinTable()
  tags = Promise;
}

export default Task;