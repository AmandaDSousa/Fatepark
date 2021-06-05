import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {Customer} from "./customer.entity";
import {ParkingType} from "../enums/parking-type.enum";
import {Partner} from "./partner.entity";

@Entity()
export class ParkingPlace {
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
  vehicle: string;

  @Column()
  vehiclePlate: string;

  @OneToOne(() => Customer)
  @JoinColumn()
  customer?: Customer;

  @OneToOne(() => Partner)
  @JoinColumn()
  partner?: Partner;

  @Column({ type: 'timestamp', nullable: true })
  entranceTime?: Date;

  @Column({ default: false })
  isOccupied: boolean;
}