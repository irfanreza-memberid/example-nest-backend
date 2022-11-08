import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Member')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  memberCode: string;

  @Column({ nullable: true, length: 50 })
  referalCode: string;

  @Column({ length: 100 })
  fullname: string;

  @Column({ length: 50 })
  phoneCode: string;

  @Column({ unique: true, length: 100 })
  phoneNumber: string;

  @Column({ unique: true, length: 100 })
  email: string;
}
