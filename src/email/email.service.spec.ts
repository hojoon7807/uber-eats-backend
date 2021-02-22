import { Test } from "@nestjs/testing";
import { CONFIG_OPTIONS } from "src/common/common.constant";
import { EmailService } from "./email.service"

jest.mock('got');
jest.mock('form-data',()=>{
    return{
        append:jest.fn(()=>{})
    }
})
describe('email service',()=>{
    let service:EmailService;
    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                EmailService,{
                    provide:CONFIG_OPTIONS,
                    useValue:{
                        apiKey:'test-apiKey',
                        domain:'test-domain',
                        fromEmail:'test-fromEmail',
                    }
                }
            ],
        }).compile();
        service = module.get<EmailService>(EmailService);
    });
    it('should be define',()=>{
        expect(service).toBeDefined();
    });
    describe('sendVerificationEmail', () => {
        it('should call send email', ()=>{
            const sendVerificationEmailArgs = {
                email:'email',
                code:'code'
            };
            jest.spyOn(service,'sendEmail').mockImplementation(async () => {})
            service.sendVerificationEmail(sendVerificationEmailArgs.email,sendVerificationEmailArgs.code)
            expect(service.sendEmail).toHaveBeenCalledTimes(1);
            expect(service.sendEmail).toHaveBeenCalledWith("Verify your Email", "d",
            [{key:"code",value:sendVerificationEmailArgs.code},
            {key:"username",value:sendVerificationEmailArgs.email}]);
        })
    })
    
    describe('sendEmail',()=>{
        it('should be send email',()=>{
            service.sendEmail('','',[]);
        })
    })
})