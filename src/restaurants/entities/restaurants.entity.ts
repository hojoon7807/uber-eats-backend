import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Restaurant{
    @PrimaryGeneratedColumn()
    @Field(type=>Number)
    id:number;

    @Field(type=>String) //()=>String graphql에 타입정의
    @Column()
    name:string;

    @Field(type=>Boolean)
    @Column()
    isVegan:boolean; 

    @Field(type=>String)
    @Column()
    address:string;

    @Field(type=>String)
    @Column()
    ownerName:string;
    
}