import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';
import Task from './Task';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = null;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email = '';

  @Column('varchar')
  firstName = '';

  @Column('varchar')
  lastName = '';

  @Column('varchar')
  @IsNotEmpty()
  passwordDigest = '';

  @OneToMany(
    () => Task,
    task => task.creator,
  )
  tasksCreator = Promise || null;

  @OneToMany(
    () => Task,
    task => task.assignedTo,
  )
  tasksExecutor = Promise || null;

  getFullName () {
    const email = this.email;
    const firstName = this.firstName || '';
    const lastName = this.lastName || '';
    return [firstName, lastName, email].join(' ');
  }

}

export default User;
