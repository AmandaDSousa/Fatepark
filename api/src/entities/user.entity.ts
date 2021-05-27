import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

import {UserTypeEnum} from "../enums/user-type.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: UserTypeEnum,
    default: UserTypeEnum.Operacional
  })
  type!: UserTypeEnum;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}