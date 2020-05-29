import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Task from './Task';

@Entity()
class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = null;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  @IsNotEmpty()
  name = '';

  @ManyToMany(() => Task, task => task.tags)
  tasks = Promise;
}

export default Tag;
