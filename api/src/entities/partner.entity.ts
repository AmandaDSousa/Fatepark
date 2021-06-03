import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "double" })
  discount: number;

  @Column({ default: true })
  isActive: boolean;
}