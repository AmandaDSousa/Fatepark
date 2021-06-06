import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {Customer} from "./customer.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer?: Customer;

  @Column({type: 'date'})
  start: Date;

  @Column({type: 'date'})
  end: Date;

  @CreateDateColumn()
  createdAt: Date;
}
