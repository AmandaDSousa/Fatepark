import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

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

  @Column()
  parkingPlaceId: number;

  @Column()
  vehicle: string;

  @Column()
  vehiclePlate: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer?: Customer;

  @ManyToOne(() => Partner)
  @JoinColumn()
  partner?: Partner;

  @Column({ type: "double precision", nullable: true })
  discountValue: number;

  @Column({ type: "double precision"})
  totalValue: number;

  @Column({ type: 'timestamp' })
  entranceTime: Date;

  @Column({ type: 'timestamp' })
  exitTime: Date;
}