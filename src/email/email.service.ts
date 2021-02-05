import { Inject, Injectable } from '@nestjs/common';
import got from "got";
import * as FormData from "form-data";
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { EmailModuleOptions } from './email.interfaces';

@Injectable()
export class EmailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options:EmailModuleOptions,
    ){this.sendEmail('testing','test')}
    private async sendEmail(subject:string, content:string){
        const form = new FormData()
        form.append('from',`Excited User <mailgun@${this.options.domain}>`)
        form.append('to',`ujuj0202@gmail.com`)
        form.append('subject',subject)
        form.append('template','d')
        form.append('v:code','asas')
        form.append('v:username','hojoon')
        const response = await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`,{
            method:'POST',
            headers:{
                Authorization:`Basic ${Buffer.from(
                    `api:${this.options.apiKey}`,
                ).toString("base64")}`
            },
            body:form,
        })
        console.log(response.body)
    }
}
