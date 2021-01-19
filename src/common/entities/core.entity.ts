import { Field } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity{
    @PrimaryColumn()
    @Field(type=>Number)
    id:number;

    @Field(type=>Date)
    @CreateDateColumn()
    createdAt:Date;

    @Field(type=>Date)
    @UpdateDateColumn()
    updatedAt:Date;
}