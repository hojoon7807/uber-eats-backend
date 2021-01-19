import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsNumber, isNumber, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// @InputType({isAbstract:true})
@ObjectType()
@Entity()
export class Restaurant{
    @PrimaryGeneratedColumn()
    @Field(type=>Number)
    @IsNumber()
    id:number;

    @Field(type=>String) //()=>String graphql에 타입정의
    @Column()
    @IsString()
    name:string;

    @Field(type=>Boolean,{defaultValue:false})
    @Column()
    @IsOptional()
    @IsBoolean()
    isVegan:boolean; 

    @Field(type=>String)
    @Column()
    @IsString()
    address:string;

    @Field(type=>String)
    @Column()
    @IsString()
    ownerName:string;
    
}