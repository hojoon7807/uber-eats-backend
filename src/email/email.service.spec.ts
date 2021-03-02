import { Test } from "@nestjs/testing";
import got from "got";
import * as FormData from "form-data";
import { CONFIG_OPTIONS } from "src/common/common.constant";
import { EmailService } from "./email.service"

jest.mock('got');
jest.mock('form-data');
const TEST_DOMAIN = 'test-domain'
describe('email service',()=>{
    let service:EmailService;
    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                EmailService,{
                    provide:CONFIG_OPTIONS,
                    useValue:{
                        apiKey:'test-apiKey',
                        domain:TEST_DOMAIN,
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
            jest.spyOn(service,'sendEmail').mockImplementation(async () => true)
            service.sendVerificationEmail(sendVerificationEmailArgs.email,sendVerificationEmailArgs.code)
            expect(service.sendEmail).toHaveBeenCalledTimes(1);
            expect(service.sendEmail).toHaveBeenCalledWith("Verify your Email", "d",
            [{key:"code",value:sendVerificationEmailArgs.code},
            {key:"username",value:sendVerificationEmailArgs.email}]);
        })
    })
    
    describe('sendEmail',()=>{
        it('should be send email',async ()=>{
            const result = await service.sendEmail('','',[{ key: 'attr', value: 'attrValue' }]);
            const formSpy = jest.spyOn(FormData.prototype,'append');
            expect(formSpy).toHaveBeenCalledTimes(5);
            expect(got.post).toHaveBeenCalledTimes(1);
            expect(got.post).toHaveBeenCalledWith(`https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,expect.any(Object));
            expect(result).toEqual(true);
            });
        it('should be fail',async()=>{
            jest.spyOn(got,'post').mockImplementation(()=>{
                throw new Error
            });
            const result = await service.sendEmail('','',[]);
            expect(result).toEqual(false);
        })
        })
    })
