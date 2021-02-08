import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { EmailService } from "src/email/email.service"
import { JwtService } from "src/jwt/jwt.service"
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
describe("User Service", ()=>{
    let service:UsersService

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
    })
    it("be define",()=>{
        expect(service).toBeDefined();
    })

    it.todo("createAccount")
    it.todo("login")
    it.todo("findById")
    it.todo("editProfile")
    it.todo("verifyEmail")
})