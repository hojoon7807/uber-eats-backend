import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { EmailService } from "src/email/email.service"
import { JwtService } from "src/jwt/jwt.service"
import { Repository } from "typeorm"
import { User } from "./entities/user.entity"
import { Verification } from "./entities/verification.entity"
import { UsersService } from "./users.service"


const mockRepository = {
    findOne:jest.fn(),
    save:jest.fn(),
    create:jest.fn(),
    delete:jest.fn(),
}
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
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers:[
                UsersService, {
                    provide: getRepositoryToken(User), useValue:mockRepository
                },
                {
                    provide: getRepositoryToken(Verification), useValue:mockRepository
                },
                {
                    provide: JwtService, useValue:mockJwtService
                },
                {
                    provide: EmailService, useValue:mockEmailService
                }
            ]
        }).compile();
        service = module.get<UsersService>(UsersService)
        usersRepository = module.get(getRepositoryToken(User))
    })
    
    it("be define",()=>{
        expect(service).toBeDefined();
    })

    describe("createAccount",()=>{
        it("should fail if user exist", async ()=>{
            usersRepository.findOne.mockResolvedValue({
                id:1,
                email:"test@gmail.com"
            })
            const result = await service.createAccount({
                email:"",
                password:"",
                role:0
            })
            expect(result).toMatchObject({ok:false, error:"There is a user with that email already"}})
        })
    })
    it.todo("createAccount")
    it.todo("login")
    it.todo("findById")
    it.todo("editProfile")
    it.todo("verifyEmail")
})