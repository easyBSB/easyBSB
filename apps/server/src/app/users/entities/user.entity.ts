import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string
  
  @Column()
  password: string

  @Column({ default: false, type: "boolean" })
  userNeedPasswordChange: boolean
}
