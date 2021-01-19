import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly userRepo:Repository<User>
    ){}
    async createAccount({email,password,role}:CreateAccountInput){
        try{
            const exist = this.userRepo.findOne({email});
            if(exist){
                //make error
                
            }
        }catch(e){

        }
        // check new user
        // create user & hash password
    }
}