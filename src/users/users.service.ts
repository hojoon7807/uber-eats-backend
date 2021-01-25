import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly userRepo:Repository<User>,
        private readonly jwtService:JwtService,
    ){}
    async createAccount({email,password,role}:CreateAccountInput):Promise<{ok:boolean; error?:string;}>{
        try{ //throw를 사용하지않는 go언어의 에러 방식
            const exist = await this.userRepo.findOne({email});
            if(exist){
                return {ok:false, error:"There is a user with that email already"};
                //make error
            }
            await this.userRepo.save(this.userRepo.create({email,password,role}));
            return {ok:true};
        }catch(error){
            return {ok:false,error:"Couldn't create account"}
        }
        // check new user
        // create user & hash password
    }
    async login({email,password}:LoginInput):Promise<{ok:boolean; error?:string; token?:string;}>{
        //1.유저찾기 2.비밀번호가 맞는지 확인하기 3.jwt 유저에게 넘겨주기
        try{
            const user = await this.userRepo.findOne({email});
            if(!user){
                return {ok:false,error:"User not found"};
            }
            const passwordCorrect = await user.checkPassword(password);
            if(!passwordCorrect){
                return {ok:false,error:"Wrong password"};
            }
            const token = this.jwtService.sign(user.id);
            return {ok:true,token}
        }catch(error){
            return {ok:false,error}
        }
    }
}