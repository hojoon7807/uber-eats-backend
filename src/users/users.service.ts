import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";
import { EmailService } from "src/email/email.service";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly userRepo:Repository<User>,
        @InjectRepository(Verification) private readonly verificationRepo:Repository<Verification>,
        private readonly jwtService:JwtService,
        private readonly emailService:EmailService,
    ){}
    async createAccount({email,password,role}:CreateAccountInput):Promise<CreateAccountOutput>{
        try{ //throw를 사용하지않는 go언어의 에러 방식
            const exist = await this.userRepo.findOne({email});
            if(exist){
                return {ok:false, error:"There is a user with that email already"};
                //make error
            }
            const user = await this.userRepo.save(this.userRepo.create({email,password,role}));
            const verification = await this.verificationRepo.save(this.verificationRepo.create({user}));
            await this.emailService.sendVerificationEmail(user.email,verification.code);
            return {ok:true};
        }catch(error){
            return {ok:false,error:"Couldn't create account"}
        }
        // check new user
        // create user & hash password
    }
    async login({email,password}:LoginInput):Promise<LoginOutput>{
        //1.유저찾기 2.비밀번호가 맞는지 확인하기 3.jwt 유저에게 넘겨주기
        try{
            const user = await this.userRepo.findOne({email},{select:["id","password"]});
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
    async findById(id:number):Promise<UserProfileOutput>{
        try{
            const user = await this.userRepo.findOneOrFail({id})
                return {
                    ok:true,
                    user
                }
            
        }catch(error){
            return {
                ok:false,
                error:"Not Found User"}
        }
    }
    async editProfile(userId:number,{email,password}:EditProfileInput):Promise<EditProfileOutput>{
        try{
            const user = await this.userRepo.findOne(userId);
            if(email){     
                user.email = email
                user.verified = false
                const verification = await this.verificationRepo.save(this.verificationRepo.create({user}));
                await this.emailService.sendVerificationEmail(user.email,verification.code);
            }
            if(password){
                user.password = password
            }
            await this.userRepo.save(user);
            return {
                ok:true
            } 
        }catch(error){
            return{
                ok:false,
                error:"Could Not update Profile"
            }
        }
    }
    async verifyEmail(code:string):Promise<VerifyEmailOutput>{
        try{
            const verification = await this.verificationRepo.findOne({code},{relations:["user"]})
            if(verification){
                verification.user.verified = true;
                await this.userRepo.save(verification.user)
                await this.verificationRepo.delete(verification.id)
                return {ok:true};
            }
            return{
                ok:false,
                error:"Verification Not Found"
            }
        }catch(error){
            return {ok:false,error:"Could not Verify Email"}
        }
    }
} 