import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MemberLoyalty')
export class MemberLoyalty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  memberId: number;

  @Column({ default: 0 })
  totalPointBalance: number;
}
