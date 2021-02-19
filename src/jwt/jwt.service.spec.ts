import { Test } from "@nestjs/testing";
import { CONFIG_OPTIONS } from "src/common/common.constant";
import { JwtService } from "./jwt.service";
import * as jwt from "jsonwebtoken";

const ID = 1
const TEST_KEY = 'testKey'
//mock npm moodule
jest.mock('jsonwebtoken',()=>{
    return{
        sign:jest.fn(()=>'TOKEN'),
        verify:jest.fn(()=>({id:ID}))
    }
    
})

describe('Jwt Service',()=>{
    let service:JwtService;
    beforeEach(async () =>{
        const module = await Test.createTestingModule({
            providers:[
                JwtService, {
                    provide:CONFIG_OPTIONS,
                    useValue:{privateKey:TEST_KEY}
                }
            ]
        }).compile();
        service = module.get<JwtService>(JwtService); 
    });
    it("be define",()=>{
        expect(service).toBeDefined();
    });
    describe('sign',()=>{
        it('should return signed token', async () => {
            const token = service.sign(ID);
            expect(typeof token).toBe('string');
            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenCalledWith({id:ID},TEST_KEY);
        });
        it('should return the decoded token', async () => {
            const TOKEN = 'TOKEN'
            const decodedToken = service.verify(TOKEN);
            expect(decodedToken).toEqual({id:ID});
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith(TOKEN,TEST_KEY);
        })
    })
})