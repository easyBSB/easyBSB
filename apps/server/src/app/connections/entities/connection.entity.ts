import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EasyBsbConnection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false })
  ip: string;

  @Column({ nullable: false })
  port: number;

  @Column({ nullable: false })
  hostId: number;
}
