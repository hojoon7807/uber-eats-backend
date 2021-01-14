import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Restaurant{
    @Field(type=>String) //()=>String graphql에 타입정의
    name:string;
    @Field(type=>Boolean)
    isVegan:boolean; 
    @Field(type=>String)
    address:string;
    @Field(type=>String)
    ownerName:string;
    
}