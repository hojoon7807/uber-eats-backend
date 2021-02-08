import { Test } from "@nestjs/testing"
import { UsersService } from "./users.service"

describe("User Service", ()=>{
    let service:UsersService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers:[
                UsersService,
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