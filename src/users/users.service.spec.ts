import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import create from "got/dist/source/create"
import { EmailService } from "src/email/email.service"
import { JwtService } from "src/jwt/jwt.service"
import { Repository } from "typeorm"
import { User } from "./entities/user.entity"
import { Verification } from "./entities/verification.entity"
import { UsersService } from "./users.service"


const mockRepository = ()=>({
    findOne:jest.fn(),
    save:jest.fn(),
    create:jest.fn(),
    delete:jest.fn(),
}) //userRepo 와 verificationRepo가 다른 것으로 인식하기위해 함수로 선언
const mockJwtService = {
    sign:jest.fn(),
    verify:jest.fn(),
}
const mockEmailService ={
    sendVerificationEmail:jest.fn(),
}
type MockRepository<T= any> = Partial<Record<keyof Repository<T>,jest.Mock>>;


describe("User Service", ()=>{
    let service:UsersService
    let usersRepository:MockRepository<User>
    let verificationRepository:MockRepository<Verification>
    let emailService:EmailService
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers:[
                UsersService, {
                    provide: getRepositoryToken(User), useValue:mockRepository()
                },
                {
                    provide: getRepositoryToken(Verification), useValue:mockRepository()
                },
                {
                    provide: JwtService, useValue:mockJwtService
                },
                {
                    provide: EmailService, useValue:mockEmailService
                }
            ]
        }).compile();
        service = module.get<UsersService>(UsersService);
        emailService = module.get<EmailService>(EmailService)
        usersRepository = module.get(getRepositoryToken(User));
        verificationRepository = module.get(getRepositoryToken(Verification));
    })
    
    it("be define",()=>{
        expect(service).toBeDefined();
    })

    describe("createAccount",()=>{
        const createAccountArgs = 
            {
                email:"",
                password:"",
                role:0
            }
        
        it("should fail if user exist", async ()=>{
            usersRepository.findOne.mockResolvedValue({
                id:1,
                email:"test@gmail.com"
            })
            const result = await service.createAccount(createAccountArgs)
            expect(result).toMatchObject({ok:false, error:"There is a user with that email already"})
        })
        it("should create user",async ()=>{
            usersRepository.findOne.mockReturnValue(undefined);
            usersRepository.create.mockReturnValue(createAccountArgs);
            usersRepository.save.mockResolvedValue(createAccountArgs);
            verificationRepository.create.mockReturnValue({user:createAccountArgs})
            verificationRepository.save.mockResolvedValue({code:'code'})
            const result = await service.createAccount(createAccountArgs);
            expect(usersRepository.create).toHaveBeenCalledTimes(1);
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
            expect(verificationRepository.create).toHaveBeenCalledTimes(1);
            expect(verificationRepository.create).toHaveBeenCalledWith({user:createAccountArgs});
            expect(verificationRepository.save).toHaveBeenCalledTimes(1);
            expect(verificationRepository.save).toHaveBeenCalledWith({user:createAccountArgs});
            expect(emailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(expect.any(String),expect.any(String));
            expect(result).toEqual({ok:true});
        })
    })
    it.todo("createAccount")
    it.todo("login")
    it.todo("findById")
    it.todo("editProfile")
    it.todo("verifyEmail")
})