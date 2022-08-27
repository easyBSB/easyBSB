import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNetworkAddress } from "@app/core/validators";

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
  @Validate(IsNetworkAddress)
  address: number;

  /**
   * @description if set to true address will converted from hex to integer
   *
  @ApiProperty({ type: "boolean" })
  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  @ApiProperty({ type: "boolean" })
  @Transform(({ value }) => value === 'true')
  address_is_hex: boolean;
  */

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
