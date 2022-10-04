import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bus {
  @ApiProperty({ type: "number" })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @description address of bus
   * we can save this only as string so we keep hex numbers
   */
  @ApiProperty({ type: "number" })
  @Column({ type: 'numeric' })
  @Type(() => Number) 
  @IsNumber({ allowNaN: false }, {
    message: `Address must be a numberic value 0 - 255, 0x00 - 0xFF`
  })
  @Min(0, {
    message: 'Address must be greater then 0'
  })
  @Max(255, {
    message: 'Address must be smaller then 255'
  })
  address: number;

  @ApiProperty({ type: "string" })
  @IsString()
  @Column()
  ip_serial: string;

  /**
   * @description name of the bus
   */
  @ApiProperty({ type: "string" })
  @IsString()
  @Column()
  name: string;

  /**
   * @description type of bus
   */
  @ApiProperty({ type: "string" })
  @IsString()
  @IsIn(['serial', 'tcpip'])
  @Column()
  type: string;

  /**
   * @description required if type is tcpip
   */
  @ApiProperty({ type: "number" })
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false
  })
  @Column({ nullable: true, type: 'numeric' })
  @Type(() => Number)
  port?: number;
}
