import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Point')
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column({ default: 0 })
  point: number;
}
