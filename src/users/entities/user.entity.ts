import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";

// type UserRole = 'client' | 'owner'| 'delivery';
enum UserRole {
    Client,
    Owner,
    Delivery
}
registerEnumType(UserRole,{name:"UserRole"})

@InputType({isAbstract:true})
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column()
    @Field(type=>String)
    email:string;

    @Field(type=>String)
    @Column()
    password:string;

    @Field(type=>UserRole)
    @Column({type:"enum",enum:UserRole})
    role: UserRole;
}