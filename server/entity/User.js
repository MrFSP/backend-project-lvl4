import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';
import _ from 'lodash';

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

  getFullName () {
    const email = this.email;
    const firstName = this.firstName || '';
    const lastName = this.lastName || '';
    return _.join([firstName, lastName, email], ' ');
  }

}

export default User;
