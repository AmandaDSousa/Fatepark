import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {Customer} from "./customer.entity";
import {ParkingType} from "../enums/parking-type.enum";
import {Partner} from "./partner.entity";

@Entity()
export class ParkingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ParkingType,
    default: null,
    nullable: true
  })
  type!: ParkingType;

  @OneToOne(() => Customer)
  @JoinColumn()
  customer?: Customer;

  @OneToOne(() => Partner)
  @JoinColumn()
  partner?: Partner;

  @Column({ type: "double precision" })
  discountValue: number;

  @Column({ type: "double precision"})
  totalValue: number;

  @Column({ type: 'timestamp' })
  entranceTime: Date;

  @Column({ type: 'timestamp' })
  exitTime: Date;
}