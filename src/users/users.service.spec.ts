import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import create from "got/dist/source/create"
import { EmailService } from "src/email/email.service"
import { JwtService } from "src/jwt/jwt.service"
import { Repository } from "typeorm"
import { isGetAccessor } from "typescript"
import { User } from "./entities/user.entity"
import { Verification } from "./entities/verification.entity"
import { UsersService } from "./users.service"


const mockRepository = ()=>({
    findOne:jest.fn(),
    save:jest.fn(),
    create:jest.fn(),
    delete:jest.fn(),
    findOneOrFail:jest.fn(),
}) //userRepo 와 verificationRepo가 다른 것으로 인식하기위해 함수로 선언
const mockJwtService = ()=>({
    sign:jest.fn(()=>'signed-token'),
    verify:jest.fn(),
})
const mockEmailService =()=>({
    sendVerificationEmail:jest.fn(),
})
type MockRepository<T= any> = Partial<Record<keyof Repository<T>,jest.Mock>>;

describe("User Service", ()=>{
    let service:UsersService
    let usersRepository:MockRepository<User>
    let verificationRepository:MockRepository<Verification>
    let emailService:EmailService;
    let jwtService:JwtService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers:[
                UsersService, {
                    provide: getRepositoryToken(User), useValue:mockRepository()
                },
                {
                    provide: getRepositoryToken(Verification), useValue:mockRepository()
                },
                {
                    provide: JwtService, useValue:mockJwtService()
                },
                {
                    provide: EmailService, useValue:mockEmailService()
                }
            ]
        }).compile();
        service = module.get<UsersService>(UsersService);
        emailService = module.get<EmailService>(EmailService);
        jwtService = module.get<JwtService>(JwtService);
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
            usersRepository.findOne.mockResolvedValue(undefined);
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
        it("should fail on exception", async () => {
            usersRepository.findOne.mockRejectedValue(new Error("error"));
            const result = await service.createAccount(createAccountArgs);
            expect(result).toEqual({ok:false,error:"Couldn't create account"})
        })
    })
    describe("login",()=>{
        const loginArgs = {
            email:"test@gmail.com",
            password:" "
        }
        it("should fail if user does not exist",async () => {
            usersRepository.findOne.mockResolvedValue(undefined);
            const result = await service.login(loginArgs);
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(usersRepository.findOne).toHaveBeenCalledWith(expect.any(Object),expect.any(Object));
            expect(result).toEqual({ok:false,error:"User not found"})
        })
        it("should fail if password is wrong", async () =>{
            const mockUser = {
                id:1,
                checkPassword:jest.fn(()=>Promise.resolve(false)),
            };
            usersRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.login(loginArgs);
            expect(result).toEqual({ ok: false, error: 'Wrong password' });
        })
        it("should return token if password correct", async () =>{
            const mockUser = {
                id:1,
                checkPassword:jest.fn(()=>Promise.resolve(true)),
            };
            usersRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.login(loginArgs);
            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
            expect(result).toEqual({ok:true,token:'signed-token'})
        })
        it('should fail on exception', async () => {
            usersRepository.findOne.mockRejectedValue(new Error('new error!'));
            const result = await service.login(loginArgs);
            expect(result).toEqual({ok:false,error:result.error});
        })
    })
    describe("findById",()=>{
        const findByIdArgs = {
            id:1
        }
        it('should find an existing user',async () => {
            usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
            const result = await service.findById(findByIdArgs.id);
            expect(result).toEqual({ok:true,user:findByIdArgs});
        })
        it('should fail if no user is found',async () => {
            usersRepository.findOneOrFail.mockRejectedValue(new Error());
            const result = await service.findById(findByIdArgs.id);
            expect(result).toEqual({ok:false,error:"Not Found User"});
        })
    })
    describe("editProfile",()=>{
        const oldUser={ 
            email:'old@User.com',
            verified:true
        };
        const newVerification = {
            code:'code'
        }
        it('should change email',async () => {
            const editProfileArgs = {
                userId:1,
                input:{email:'new@User.com'}
            }
            const newUser = {
                verified:false,
                email:editProfileArgs.input.email
            }
            usersRepository.findOne.mockResolvedValue(oldUser);
            verificationRepository.create.mockReturnValue(newVerification);
            verificationRepository.save.mockResolvedValue(newVerification);
            await service.editProfile(editProfileArgs.userId,editProfileArgs.input);
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(usersRepository.findOne).toHaveBeenCalledWith(editProfileArgs.userId);
            expect(verificationRepository.create).toHaveBeenCalledTimes(1);
            expect(verificationRepository.create).toHaveBeenCalledWith({user:newUser});
            expect(verificationRepository.save).toHaveBeenCalledWith(newVerification);
            expect(emailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(newUser.email,newVerification.code);
        });
        it('should change password',async () => {
            const editProfileArgs = {
                userId:1,
                input:{password:'new.password'}
            }
            usersRepository.findOne.mockResolvedValue({password:"old.password"});
            const result = await service.editProfile(editProfileArgs.userId,editProfileArgs.input);
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
            expect(result).toEqual({ok:true});
        })
        it('should fail on exception',async () => {
            usersRepository.findOne.mockRejectedValue(new Error());
            const result = await service.editProfile(1,{email:"error"});
            expect(result).toEqual({ok:false,
                error:"Could Not update Profile"});
        })
    })
    describe("verifyEmail",()=>{
        
    })
})