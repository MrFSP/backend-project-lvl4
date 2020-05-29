import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
class TaskStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = null;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  @IsNotEmpty()
  name = '';
}

export default TaskStatus;
