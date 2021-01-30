import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import {User} from "./entities/user.entity";
import { UsersService } from "./users.service";


@Resolver(of=>User)
export class UsersResolver{
    constructor(private readonly usersService: UsersService){}
    @Query(returns=>Boolean)
    hi():boolean{
        return true;
    }
    @Mutation(returns=>CreateAccountOutput)
    async createAccount(@Args('input')createAccountInput:CreateAccountInput):Promise<CreateAccountOutput>{
        try{
            return await this.usersService.createAccount(createAccountInput)
    }catch(error){
            return{
                error,
                ok:false
            } 
        }
    }

    @Mutation(returns=>LoginOutput)
    async login(@Args('input')loginInput:LoginInput):Promise<LoginOutput>{
        try{
            return await this.usersService.login(loginInput);
        }catch(error){
            return {ok:false,error}
        }
    }
    
    @Query(returns=>User)
    @UseGuards(AuthGuard)
    me(@AuthUser()authUser:User){
        return authUser;
    }

    @UseGuards(AuthGuard)
    @Query(returns=>UserProfileOutput)
    async serProfile(@Args()userProfileInput:UserProfileInput):Promise<UserProfileOutput>{
        try{
            const user = await this.usersService.findById(userProfileInput.userId)
        }catch(e){
            return {error:'Not Found User', ok:false}
    }
}
}