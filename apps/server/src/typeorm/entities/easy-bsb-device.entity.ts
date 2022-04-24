import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class EasyBsbDevice {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  deviceId: number

  @Column({ nullable: false })
  family: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  variant: number
}