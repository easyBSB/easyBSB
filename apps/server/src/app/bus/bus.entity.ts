import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bus {
  @ApiProperty({ type: "number" })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @description address of bus
   */
  @ApiProperty({ type: "number" })
  @IsNumber({
    allowInfinity: false,
    allowNaN: false
  })
  @Column({ type: 'numeric' })
  @ApiProperty({ type: "number" })
  @Transform(({ value, obj }) => 
    obj.address_is_hex.toString() === 'true' ? parseInt(value, 16) : parseInt(value, 10)
  )
  address: number;

  /**
   * @description if set to true address will converted from hex to integer
   */
  @ApiProperty({ type: "boolean" })
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  @ApiProperty({ type: "boolean" })
  @Transform(({ value }) => value === 'true')
  address_is_hex: boolean;

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
