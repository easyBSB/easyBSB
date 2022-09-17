import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Device {
  @ApiProperty({ type: "number" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: "number" })
  @IsNumber()
  @Column()
  @Type(() => Number)
  bus_id: number;

  /**
   * @description address in bus
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

  @ApiProperty({ type: "number" })
  @IsNumber()
  @Column()
  @Type(() => Number)
  vendor: number;

  @ApiProperty({ type: "number" })
  @IsNumber({
    allowInfinity: false,
    allowNaN: false
  })
  @Column({ nullable: true, type: 'numeric' })
  @Type(() => Number)
  vendor_device: number;
}
