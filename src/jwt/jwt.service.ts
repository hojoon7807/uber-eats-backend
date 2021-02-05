import { Inject, Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options:JwtModuleOptions,
    ){console.log(options)}
    sign(userId:number):string {
        return jwt.sign({id:userId}, this.options.privateKey);
        // jwt.sign({id:user.id}, this.config.get("SECRET_KEY"));
    }
    verify(token:string){
        return jwt.verify(token,this.options.privateKey);
    }
}
