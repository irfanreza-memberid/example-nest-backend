import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MemberLog')
export class MemberLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column({ length: 100 })
  field: string;

  @Column({ nullable: true, length: 100 })
  beforeValue: string;

  @Column({ length: 100 })
  afterValue: string;
}
