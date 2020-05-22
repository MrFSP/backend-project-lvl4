import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = null;

  @Column('varchar')
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
}

export default User;
